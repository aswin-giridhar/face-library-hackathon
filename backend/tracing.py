"""Anyway SDK -- OpenTelemetry tracing for Face Library agent pipeline.

Uses the official Anyway SDK (anyway-sdk) for automatic LLM call instrumentation
plus custom OpenTelemetry spans for session, agent, and tool-level observability.

The SDK auto-instruments all OpenAI client calls (used by FLock, Z.AI, OpenRouter),
capturing prompts, completions, token usage, latency, and model metadata.
"""
import os
import time
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

_TRACING_ENABLED = False
_tracer = None
StatusCode = None

try:
    from anyway.sdk import Traceloop
    from opentelemetry import trace
    from opentelemetry.trace import StatusCode as _StatusCode

    ANYWAY_API_KEY = os.getenv("ANYWAY_API_KEY", "")

    if ANYWAY_API_KEY:
        Traceloop.init(
            app_name="face-library",
            api_endpoint="https://trace-dev-collector.anyway.sh/",
            headers={"Authorization": f"Bearer {ANYWAY_API_KEY}"},
        )
        _tracer = trace.get_tracer("face-library", "2.0.0")
        _TRACING_ENABLED = True
        StatusCode = _StatusCode
        print("[Tracing] Anyway SDK initialized -- auto-instrumenting OpenAI calls")
    else:
        print("[Tracing] ANYWAY_API_KEY not set -- tracing disabled (spans will be no-ops)")

except ImportError as e:
    print(f"[Tracing] Anyway SDK not installed ({e}) -- tracing disabled")


class _NoOpSpan:
    """Fallback span when tracing is disabled."""
    def set_attribute(self, key, value): pass
    def set_status(self, status, description=None): pass
    def add_event(self, name, attributes=None): pass
    def record_exception(self, exc): pass
    def end(self): pass
    def __enter__(self): return self
    def __exit__(self, *args): pass


class _NoOpStatusCode:
    OK = "OK"
    ERROR = "ERROR"


if not _TRACING_ENABLED:
    StatusCode = _NoOpStatusCode


@contextmanager
def trace_session(session_id: str, metadata: dict = None):
    """Top-level span for a full license processing session."""
    if not _TRACING_ENABLED:
        yield _NoOpSpan()
        return

    with _tracer.start_as_current_span(
        "license_pipeline",
        attributes={
            "session.id": str(session_id),
            "session.type": "license_processing",
            **(metadata or {}),
        },
    ) as span:
        yield span


@contextmanager
def trace_agent(agent_name: str, action: str, metadata: dict = None):
    """Span for an individual agent invocation."""
    if not _TRACING_ENABLED:
        yield _NoOpSpan()
        return

    with _tracer.start_as_current_span(
        f"agent.{agent_name}",
        attributes={
            "agent.name": agent_name,
            "agent.action": action,
            **(metadata or {}),
        },
    ) as span:
        yield span


@contextmanager
def trace_llm_call(model: str, provider: str, agent_name: str = ""):
    """Span for a single LLM API call with token/latency tracking.

    Note: The Anyway SDK auto-instruments OpenAI client calls, capturing
    prompts, completions, and tokens automatically. This span provides
    additional context (agent name, provider tier) for correlation.
    """
    if not _TRACING_ENABLED:
        yield _NoOpSpan()
        return

    with _tracer.start_as_current_span(
        f"llm.{provider}.{model}",
        attributes={
            "llm.model": model,
            "llm.provider": provider,
            "agent.name": agent_name,
        },
    ) as span:
        span._start_time_ns = time.time_ns()
        yield span


@contextmanager
def trace_tool(tool_name: str, operation: str, metadata: dict = None):
    """Span for database or tool operations."""
    if not _TRACING_ENABLED:
        yield _NoOpSpan()
        return

    with _tracer.start_as_current_span(
        f"tool.{tool_name}",
        attributes={
            "tool.name": tool_name,
            "tool.operation": operation,
            **(metadata or {}),
        },
    ) as span:
        yield span


def record_llm_result(span, result: dict):
    """Record LLM call results on a span."""
    if not _TRACING_ENABLED:
        return
    span.set_attribute("llm.tokens.total", result.get("tokens_used", 0))
    span.set_attribute("llm.model_used", result.get("model", ""))
    span.set_attribute("llm.provider", result.get("provider", ""))
    if result.get("error"):
        span.set_status(StatusCode.ERROR, result["error"])
    else:
        span.set_status(StatusCode.OK)

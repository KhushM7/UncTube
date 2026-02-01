import argparse
def prompt_if_missing(value: str | None, label: str) -> str:
    if value:
        return value
    entered = input(f"{label}: ").strip()
    if not entered:
        raise SystemExit(f"{label} is required.")
    return entered


def parse_list(values: list[str] | None, label: str) -> list[str]:
    if values:
        return [value.strip() for value in values if value.strip()]
    entered = input(f"{label} (comma-separated, optional): ").strip()
    if not entered:
        return []
    return [value.strip() for value in entered.split(",") if value.strip()]


def add_server_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--api", default="http://localhost:8000", help="API base URL")

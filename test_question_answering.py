import argparse
import json

import requests

from test_e2e_helpers import add_server_args


DEFAULT_QUESTION = "How did you improve your fitness in the gym?"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Ask a question and inspect retrieval/Q&A output."
    )
    add_server_args(parser)
    parser.add_argument("--profile-id", required=True, help="Profile UUID")
    parser.add_argument(
        "--question",
        default=DEFAULT_QUESTION,
        help="Question to ask",
    )
    args = parser.parse_args()

    try:
        ask_payload = {"question": args.question}
        ask_resp = requests.post(
            f"{args.api}/api/v1/profiles/{args.profile_id}/ask",
            json=ask_payload,
            timeout=60,
        )
        ask_resp.raise_for_status()
        ask_data = ask_resp.json()

        print(json.dumps(ask_data, indent=2))
    finally:
        pass


if __name__ == "__main__":
    main()

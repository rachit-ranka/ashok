#!/usr/bin/env python3
"""Build assets/catalog.json (compact) from assets/product-catalog.csv.

Usage: python3 scripts/build-catalog.py

The site ships the catalog as an array-of-arrays rather than an array of
objects to keep the payload small -- field order is mirrored by FIELDS in
catalog.html, so keep the two in sync.
"""
import csv
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "product-catalog.csv"
OUT = ROOT / "assets" / "catalog.json"

# CSV column -> position in each output row.
COLUMNS = [
    "Product Name",
    "Salts",
    "MRP",
    "Company",
    "Packing",
    "Dosage Form",
    "Composition",
    "Therapeutic Segment",
    "Indication",
    "Division",
    "SKU",
]

# Present in the source export but deliberately not shipped: they are internal
# data-lineage / QA fields ("main", "torrent", "manual"; "master", "stock file")
# with no meaning to a customer, and omitting them keeps the payload smaller.
# The full CSV stays in the repo if they are ever needed.
IGNORED = ["Composition Source", "Review Flag"]


def clean(value):
    return " ".join(value.split()) if value else ""


def mrp(value):
    """Normalise MRP to a plain number string, or '' when absent."""
    value = clean(value).replace(",", "")
    if not value:
        return ""
    try:
        return f"{float(value):.2f}"
    except ValueError:
        return ""


def main():
    if not SRC.exists():
        sys.exit(f"missing source catalog: {SRC}")

    with SRC.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        missing = [c for c in COLUMNS if c not in reader.fieldnames]
        if missing:
            sys.exit(f"source catalog is missing columns: {', '.join(missing)}")

        rows = []
        skipped = 0
        for record in reader:
            name = clean(record["Product Name"])
            if not name:
                skipped += 1
                continue
            rows.append(
                [
                    mrp(record[col]) if col == "MRP" else clean(record[col])
                    for col in COLUMNS
                ]
            )

    # Trailing empty fields are dropped; catalog.html reads them as ''.
    for row in rows:
        while row and row[-1] == "":
            row.pop()

    OUT.write_text(json.dumps(rows, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {len(rows)} products -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size:,} bytes)")
    if skipped:
        print(f"skipped {skipped} row(s) with no product name")


if __name__ == "__main__":
    main()

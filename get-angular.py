import os
from pathlib import Path

# =========================
# --- CẤU HÌNH ---
# =========================
OUTPUT_FILENAME = "project_source_code.txt"

# Các đuôi file muốn lấy (Source code + Config)
TARGET_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx",
    ".html", ".scss", ".css", ".less",
    ".json", ".md", ".yml", ".yaml"
}

# Các file config quan trọng
SPECIFIC_FILES = {
    "angular.json", "package.json", "tsconfig.json", "tsconfig.app.json",
    "README.md"
}

# Các thư mục CẦN BỎ QUA
IGNORE_DIRS = {
    "node_modules",
    ".git",
    ".angular",
    "dist",
    ".vscode",
    "coverage",
    ".idea",
    "build",
    "out"
}

# =========================
# --- CHỈ LẤY BUSINESS CONTEXT ---
# =========================
# Các folder nên lấy để hiểu business context (ưu tiên)
INCLUDE_DIR_PREFIXES = [
    Path("src/app/pages"),
    Path("src/app/features"),
    Path("src/app/services"),

    # Bonus thường giúp hiểu domain / usecase
    Path("src/app/core"),
    Path("src/app/shared"),
    Path("src/app/models"),
    Path("src/app/types"),
    Path("src/app/state"),
    Path("src/app/store"),
]

# Các file routing / bootstrap hay cần
INCLUDE_FILE_PATTERNS = [
    "src/app/app.routes.ts",
    "src/app/**/app.routes.ts",
    "src/app/**/*.routes.ts",  # nhiều team đặt dạng *.routes.ts
    "src/app/app.config.ts",
    "src/app/app.module.ts",
    "src/main.ts",
]

# Giới hạn file để tránh output quá khủng
MAX_FILE_SIZE_BYTES = 1_500_000  # ~1.5MB / file


def is_ignored_dir(dirname: str) -> bool:
    return dirname in IGNORE_DIRS


def match_any_pattern(rel_posix: str, patterns: list[str]) -> bool:
    """
    Hỗ trợ glob kiểu ** bằng Path.match.
    rel_posix: đường dẫn dạng posix, ví dụ src/app/a/b.ts
    """
    p = Path(rel_posix)
    return any(p.match(pattern) for pattern in patterns)


def should_include_by_context(rel_path: Path) -> bool:
    """
    True nếu file nằm trong pages/features/services (hoặc các folder bonus),
    hoặc match các file pattern quan trọng (routing/bootstrap).
    """
    # normalize
    rel_norm = rel_path.as_posix()

    # match routing/bootstrap patterns
    if match_any_pattern(rel_norm, INCLUDE_FILE_PATTERNS):
        return True

    # nằm trong các thư mục ưu tiên
    for prefix in INCLUDE_DIR_PREFIXES:
        try:
            # rel_path is under prefix?
            rel_path.relative_to(prefix)
            return True
        except ValueError:
            pass

    return False


def should_include_general(rel_path: Path) -> bool:
    """
    Fallback: include theo extension / specific files
    """
    name = rel_path.name
    ext = rel_path.suffix.lower()

    # .env, .env.local...
    if name.startswith(".env"):
        return True

    return (ext in TARGET_EXTENSIONS) or (name in SPECIFIC_FILES)


def safe_read_text(path: Path) -> str | None:
    """
    Đọc text an toàn với nhiều encoding.
    Trả None nếu fail.
    """
    for enc in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            return path.read_text(encoding=enc)
        except Exception:
            continue
    return None


def collect_files():
    root_dir = Path.cwd()
    output_path = root_dir / OUTPUT_FILENAME

    print(f"--- BẮT ĐẦU QUÉT TẠI {root_dir} ---")
    print("Ưu tiên: src/app/pages | src/app/features | src/app/services | routing/app.routes.ts ...")

    included = []
    skipped_large = []
    failed = []

    # walk
    for current_root, dirs, files in os.walk(root_dir):
        # lọc bỏ ignore dirs (in-place)
        dirs[:] = [d for d in dirs if not is_ignored_dir(d)]

        current_root_path = Path(current_root)

        for filename in files:
            # bỏ qua output và script
            if filename == OUTPUT_FILENAME or filename == Path(__file__).name:
                continue

            full_path = current_root_path / filename
            rel_path = full_path.relative_to(root_dir)

            # skip binary nhanh theo extension phổ biến
            if rel_path.suffix.lower() in {
                ".png", ".jpg", ".jpeg", ".gif", ".webp",
                ".pdf", ".zip", ".rar", ".7z",
                ".exe", ".dll", ".so", ".dylib",
                ".mp4", ".mov", ".mp3", ".wav",
                ".woff", ".woff2", ".ttf", ".eot"
            }:
                continue

            # ưu tiên lấy business context
            if should_include_by_context(rel_path) or (rel_path.name in SPECIFIC_FILES):
                pass
            else:
                # không thuộc nhóm context => không lấy (để file gọn)
                continue

            # giới hạn size
            try:
                size = full_path.stat().st_size
                if size > MAX_FILE_SIZE_BYTES:
                    skipped_large.append(rel_path.as_posix())
                    continue
            except Exception:
                pass

            content = safe_read_text(full_path)
            if content is None:
                failed.append(rel_path.as_posix())
                continue

            included.append((rel_path.as_posix(), content))

    # Nếu chưa lấy được gì (repo khác cấu trúc), fallback quét general
    if not included:
        print("[WARN] Không tìm thấy files theo nhóm business context. Fallback: quét theo extension/config phổ biến...")
        for current_root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if not is_ignored_dir(d)]
            current_root_path = Path(current_root)

            for filename in files:
                if filename == OUTPUT_FILENAME or filename == Path(__file__).name:
                    continue

                full_path = current_root_path / filename
                rel_path = full_path.relative_to(root_dir)

                if not should_include_general(rel_path):
                    continue

                try:
                    if full_path.stat().st_size > MAX_FILE_SIZE_BYTES:
                        skipped_large.append(rel_path.as_posix())
                        continue
                except Exception:
                    pass

                content = safe_read_text(full_path)
                if content is None:
                    failed.append(rel_path.as_posix())
                    continue

                included.append((rel_path.as_posix(), content))

    # sort cho dễ đọc
    included.sort(key=lambda x: x[0])

    # write output
    with open(output_path, "w", encoding="utf-8") as out_file:
        out_file.write(f"ROOT: {root_dir}\n")
        out_file.write("COLLECT MODE: business-context-first\n\n")

        for rel_posix, content in included:
            out_file.write("\n" + "=" * 80 + "\n")
            out_file.write(f"FILE PATH: {rel_posix}\n")
            out_file.write("=" * 80 + "\n")
            out_file.write(content)
            if not content.endswith("\n"):
                out_file.write("\n")

        # summary
        out_file.write("\n" + "=" * 80 + "\n")
        out_file.write("SUMMARY\n")
        out_file.write("=" * 80 + "\n")
        out_file.write(f"Included files: {len(included)}\n")
        out_file.write(f"Skipped (too large): {len(skipped_large)}\n")
        out_file.write(f"Failed to read: {len(failed)}\n")

        if skipped_large:
            out_file.write("\n--- Skipped (too large) ---\n")
            for p in skipped_large[:200]:
                out_file.write(p + "\n")
            if len(skipped_large) > 200:
                out_file.write(f"... ({len(skipped_large)-200} more)\n")

        if failed:
            out_file.write("\n--- Failed to read ---\n")
            for p in failed[:200]:
                out_file.write(p + "\n")
            if len(failed) > 200:
                out_file.write(f"... ({len(failed)-200} more)\n")

    print("\n--- HOÀN TẤT! ---")
    print(f"Included: {len(included)} | Skipped large: {len(skipped_large)} | Failed: {len(failed)}")
    print(f"Kiểm tra file kết quả tại: {output_path}")


if __name__ == "__main__":
    collect_files()

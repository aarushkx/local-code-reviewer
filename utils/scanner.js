import fs from "fs/promises";
import path from "path";

// TODO: Add more valid extensions to the set
const VALID_EXTENSIONS = new Set([
    ".js", ".jsx", ".ts", ".tsx", // JavaScript/TypeScript
    ".py", ".pyw", // Python
    ".java", ".kt", ".scala", // JVM languages
    ".c", ".cpp", ".cc", ".h", ".hpp", // C/C++
    ".go", // Go
    ".rs", // Rust
    ".php", // PHP
    ".rb", // Ruby
    ".swift", // Swift
    ".cs", // C#
    ".asm", ".s", // Assembly
    ".sql", // SQL
    ".sh", ".bash", // Shell scripts
]);

// TODO: Add more dirs to the set
const IGNORE_DIRS = new Set([
    "node_modules",
    "__pycache__",
    ".git",
    ".svn",
    ".hg",
    "dist",
    "build",
    "out",
    "target",
    "bin",
    "obj",
    ".next",
    ".nuxt",
    "coverage",
    ".venv",
    "venv",
    "env",
    ".pytest_cache",
    ".mypy_cache",
    ".tox",
    "vendor",
    "_generated",
]);

const IGNORE_FILES = new Set([
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "Cargo.lock",
    "Gemfile.lock",
    "composer.lock",
    ".DS_Store",
    "Thumbs.db",
]);

export const scanCodebase = async (rootDir = ".", allFiles = []) => {
    try {
        const elements = await fs.readdir(rootDir, { withFileTypes: true });

        for (const elem of elements) {
            const fullPath = path.join(rootDir, elem.name);

            // Ignore unnecessary folders
            if (elem.isDirectory()) {
                if (!IGNORE_DIRS.has(elem.name)) {
                    // Recursive scan
                    await scanCodebase(fullPath, allFiles);
                }
            }

            // Check for valid files
            if (elem.isFile()) {
                const ext = path.extname(elem.name);
                if (VALID_EXTENSIONS.has(ext) && !IGNORE_FILES.has(elem.name)) {
                    allFiles.push(fullPath);
                }
            }
        }
    } catch (error) {
        console.warn(`⚠️  Cannot read directory: ${rootDir}`);
    }
    return allFiles;
};

export const reviewSourceFiles = async (_id, sourceFiles, reviewerAgent) => {
    let total = sourceFiles.length;
    let success = 0;
    let failed = 0;

    if (total === 0) {
        console.log("⚠️ No files to review!\n");
    }

    console.log(`📊 Found ${total} files to review\n`);

    for (let i = 0; i < sourceFiles.length; i++) {
        const currFile = sourceFiles[i];
        const progress = `[${i + 1}/${total}]`;

        try {
            console.log(`${progress} Reviewing: ${currFile}`);
            await reviewerAgent.reviewFile(_id, currFile);
            success++;
        } catch (error) {
            console.log(
                `${progress} ❌ Failed: ${currFile} - ${error.message}`,
            );
            failed++;
        }
    }

    console.log("\n✅ Review complete!");
    console.log(`Total: ${total}`);
    console.log(`Successful: ${success}`);
    console.log(`Failed: ${failed}\n`);
};

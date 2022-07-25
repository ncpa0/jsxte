import chalk from "chalk";
import execa from "execa";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit(path.resolve(__dirname, ".."));

async function hasUncommittedChanges() {
  const status = await git.status();

  return (
    status.not_added.length > 0 ||
    status.created.length > 0 ||
    status.deleted.length > 0 ||
    status.modified.length > 0 ||
    status.renamed.length > 0 ||
    status.staged.length > 0
  );
}

async function gitAdd() {
  await git.add(".");
}

export default async function main(onProgress: (msg: string) => void) {
  onProgress("building");
  await execa("npm", ["run", "build"]);

  onProgress(`detecting uncommitted changes`);
  if (await hasUncommittedChanges()) {
    await gitAdd();
    throw new Error(chalk.yellow("Commit your changes!"));
  }
}

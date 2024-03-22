import Constants from "expo-constants";
const { manifest } = Constants;

const ENVIRONMENTS = Object.freeze({
  PRODUCTION: "production",
  DEVELOPMENT: "development",
});

function getEnvironment() {
  const isRunningAProductionBuildOnTheServer =
    manifest.packagerOpts == null && process.env.NODE_ENV === "production";

  if (isRunningAProductionBuildOnTheServer) {
    return ENVIRONMENTS.PRODUCTION;
  }

  const inExpo = Constants.manifest && !!Constants.manifest.debuggerHost;
  const inBrowser = typeof document !== "undefined";

  const isRunningOnLocalMachine =
    process.env.NODE_ENV === "development" && (inExpo || inBrowser);

  if (isRunningOnLocalMachine) {
    return ENVIRONMENTS.DEVELOPMENT;
  }

  // Its important to throw an error here. We don't want to be using live when we shouldn't, and we
  // really don't want users to be using dev when they shouldn't.
  throw new Error("Can't get user environment! Aborting.");
}

function isInProductionEnvironment() {
  return getEnvironment() === ENVIRONMENTS.PRODUCTION;
}

export { isInProductionEnvironment };

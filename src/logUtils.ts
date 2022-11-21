import * as loglevel from "loglevel";

export function getLogger() {
  const level =
    (localStorage.getItem("loglevel:cerberus") as loglevel.LogLevelDesc) ||
    "INFO";
  const log = loglevel.getLogger("cerberus");
  log.setLevel(level);
  return log;
}

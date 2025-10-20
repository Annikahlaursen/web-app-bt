// Helpers to update localStorage.currentUser and broadcast a custom event
export function dispatchCurrentUserChanged(detail = null) {
  try {
    const ev = new CustomEvent("currentUserChanged", { detail });
    window.dispatchEvent(ev);
  } catch (err) {
    console.error("dispatchCurrentUserChanged failed:", err);
  }
}

export function setCurrentUserStorage(obj) {
  try {
    localStorage.setItem("currentUser", JSON.stringify(obj));
    // also set isAuth
    localStorage.setItem("isAuth", "true");
    dispatchCurrentUserChanged(obj);
  } catch (err) {
    console.warn("Could not write currentUser to localStorage", err);
  }
}

export function clearCurrentUserStorage() {
  try {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuth");
    dispatchCurrentUserChanged(null);
  } catch (err) {
    console.warn("Could not clear currentUser from localStorage", err);
  }
}

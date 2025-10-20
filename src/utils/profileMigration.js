// profileMigration.js
// Simple migration run at app startup to normalize profile keys in localStorage

export function migrateLocalProfile() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;
    const currentUser = JSON.parse(raw);
    const profile = currentUser.profile || {};

    // If already migrated (has fornavn/efternavn) do nothing
    if (profile.fornavn || profile.efternavn) return;

    // Map known legacy keys
    const fornavn = profile.firstName || profile.name || profile.fornavn || "";
    const efternavn =
      profile.lastName || profile.lastname || profile.efternavn || "";

    if (fornavn || efternavn) {
      profile.fornavn = fornavn;
      profile.efternavn = efternavn;
      // Also keep legacy keys for compatibility
      currentUser.profile = profile;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      console.info(
        "Profile migration: migrated localProfile to fornavn/efternavn"
      );
    }
  } catch (err) {
    console.error("Profile migration failed:", err);
  }
}

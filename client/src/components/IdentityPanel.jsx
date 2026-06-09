import { useChatStore } from "../store/chatStore";

const getPlatformLabel = (platform) => {
  const labels = {
    twitch: "Twitch",
    kick: "Kick",
    x: "X",
  };

  return labels[platform] || platform;
};

const IdentityPanel = () => {
  const identityMatches = useChatStore((state) => state.identityMatches);

  return (
    <section className="identity-panel">
      <div className="identity-panel__header">
        <div>
          <span className="identity-panel__eyebrow">Cross-platform</span>
          <h2 className="identity-panel__title">Identity matches</h2>
        </div>

        <span className="identity-panel__count">{identityMatches.length}</span>
      </div>

      {identityMatches.length === 0 ? (
        <div className="identity-panel__empty">
          <p>Nessuna identità condivisa rilevata.</p>

          <span>
            I match appariranno quando lo stesso utente verrà riconosciuto su
            piattaforme differenti.
          </span>
        </div>
      ) : (
        <div className="identity-panel__list">
          {identityMatches.map((identity) => {
            const profiles = Array.isArray(identity.profiles)
              ? identity.profiles
              : [];

            const mainUser = profiles[0]?.user;

            return (
              <article
                className="identity-panel__match"
                key={identity.identityId}
              >
                <div className="identity-panel__match-header">
                  <strong>
                    {mainUser?.displayName ||
                      mainUser?.username ||
                      "Utente condiviso"}
                  </strong>

                  <span>{identity.platformCount} piattaforme</span>
                </div>

                <div className="identity-panel__platforms">
                  {profiles.map((profile, index) => {
                    const profileUser = profile.user || {};

                    return (
                      <div
                        className="identity-panel__profile"
                        key={`${identity.identityId}-${profile.platform}-${index}`}
                      >
                        <span
                          className={`identity-panel__platform identity-panel__platform--${profile.platform}`}
                        >
                          {getPlatformLabel(profile.platform)}
                        </span>

                        <span className="identity-panel__username">
                          @{profileUser.username || "unknown"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default IdentityPanel;

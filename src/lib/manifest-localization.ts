import i18n from '@/i18n';

/**
 * Updates the PWA manifest with localized content
 */
export const updateManifestLocalization = () => {
  const t = i18n.t;

  // Fetch the manifest
  fetch('/manifest.json')
    .then(response => response.json())
    .then(manifest => {
      // Update manifest with localized content
      const updatedManifest = {
        ...manifest,
        name: t('html.title'),
        description: t('html.description'),
        lang: i18n.language,
      };

      // Create a new manifest blob
      const manifestBlob = new Blob(
        [JSON.stringify(updatedManifest, null, 2)],
        {
          type: 'application/json',
        }
      );

      // Create a URL for the updated manifest
      const manifestUrl = URL.createObjectURL(manifestBlob);

      // Update the manifest link in the document
      const manifestLink = document.querySelector(
        'link[rel="manifest"]'
      ) as HTMLLinkElement;
      if (manifestLink) {
        manifestLink.href = manifestUrl;
      }
    })
    .catch(error => {
      console.error('Failed to update manifest localization:', error);
    });
};

/**
 * Initializes manifest localization and sets up language change listener
 */
export const initializeManifestLocalization = () => {
  // Update immediately
  updateManifestLocalization();

  // Listen for language changes
  i18n.on('languageChanged', () => {
    updateManifestLocalization();
  });
};

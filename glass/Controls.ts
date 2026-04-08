type LevaControlsState = Record<string, unknown>;

type LevaLang = {
  'editor.importSuccessMessage': string;
  'editor.importFailedMessage': (message: string) => string;
  'editor.export'?: string;
  'editor.import'?: string;
  [key: string]: string | ((message: string) => string) | undefined;
};

export function useLevaControls() {
  return {
    controls: {} as LevaControlsState,
    controlsAPI: (_nextControls: LevaControlsState) => {},
    lang: {
      'editor.importSuccessMessage': '',
      'editor.importFailedMessage': (message: string) => message,
    } as LevaLang,
  };
}

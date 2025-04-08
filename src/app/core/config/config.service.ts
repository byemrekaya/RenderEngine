import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configMap = new Map<string, any>();

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    this.configMap.set('vehicle-type-config', {
      title: 'Welche Fahrzeugart möchten Sie zulassen?',
      subtitle: 'Bitte wählen Sie eine der verfügbaren Optionen aus.',
      options: [
        { id: 1, label: 'Pkw' },
        { id: 2, label: 'Leichtmotorrad (weniger als 125 ccm Hubraum)' },
        { id: 3, label: 'Motorrad (125 ccm Hubraum oder mehr)' },
        { id: 4, label: 'Anhänger' },
      ],
      validations: {
        required: true,
      },
    });

    this.configMap.set('vehicle-age-config', {
      title: 'Bitte Fahrzeugalter auswählen',
      options: [
        { id: 1, label: 'Neufahrzeug' },
        { id: 2, label: 'Gebrauchtwagen' },
        { id: 3, label: 'Oldtimer' },
      ],
      validations: {
        required: true,
      },
    });
  }

  async loadConfig(key: string): Promise<any> {
    return new Promise((resolve) => {
      const config = this.configMap.get(key);
      if (!config) {
        throw new Error(`Config not found for key: ${key}`);
      }
      resolve(config);
    });
  }
}

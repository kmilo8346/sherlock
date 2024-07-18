import { dataSourceClient } from './clients';
import { analyzer } from './lib/Analyzer';

class Job {
  async run() {
    // - Busca los data sources activos
    // - Recorro los data sources activos
    //   - Genero insights

    // 1. Busca los data sources activos
    let from = 0;
    const size = 10;
    while (true) {
      const dataSources = await dataSourceClient.getAll({
        from,
        size,
        filter: {
          enabled: true,
        },
      });

      // 2. Recorro los data sources
      for (const dataSource of dataSources.data) {
        // 3. Genero insights
        await analyzer.generateInsights(dataSource);
      }

      // Paginación
      from += size;

      // Condicion de salida
      // Cuando los datos sean menor al tamaño pedido
      if (dataSources.data.length < dataSources.size) {
        break;
      }
    }
  }
}

export const job = new Job();

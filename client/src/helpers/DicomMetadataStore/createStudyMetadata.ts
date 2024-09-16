import createSeriesMetadata from './createSeriesMetadata';
import { InstanceMetadata, StudyMetadata } from './dicomTypes';

function createStudyMetadata(StudyInstanceUID: string): StudyMetadata {
  return {
    StudyInstanceUID,
    StudyDescription: '',
    ModalitiesInStudy: [],
    isLoaded: false,
    series: [],
    /**
     * @param {object} instance
     */
    addInstanceToSeries: function (instance: InstanceMetadata) {
      this.addInstancesToSeries([instance]);
    },
    /**
     * @param {object[]} instances
     * @param {string} instances[].SeriesInstanceUID
     * @param {string} instances[].StudyDescription
     */
    addInstancesToSeries: function (instances: InstanceMetadata[]) {
      const { SeriesInstanceUID } = instances[0];
      if (!this.StudyDescription) {
        this.StudyDescription = instances[0].StudyDescription;
      }
      let series = this.series.find((s) => s.SeriesInstanceUID === SeriesInstanceUID);

      if (!series) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        series = createSeriesMetadata(SeriesInstanceUID!);
        this.series.push(series);
      }

      series.addInstances(instances);
    },

    setSeriesMetadata: function (SeriesInstanceUID, seriesMetadata) {
      let existingSeries = this.series.find((s) => s.SeriesInstanceUID === SeriesInstanceUID);

      if (existingSeries) {
        existingSeries = Object.assign(existingSeries, seriesMetadata);
      } else {
        const series = createSeriesMetadata(SeriesInstanceUID);
        this.series.push(Object.assign(series, seriesMetadata));
      }
    },
  };
}

export default createStudyMetadata;

import {Pie} from "vue-chartjs";
import converters from '../../utils/converters.js';
export default {
  extends: Pie,
  props: ["data"],
  mounted() {
  //show dollar friendly
   let options = {
    tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            return converters.getDollarFriendly(data.datasets[0].data[tooltipItem.index]);
          }
        }
      }
    }
  //return chart
    this.renderChart(this.data, options);
  }
};


Vue.component('donutChart', {
    template: '#donutTemplate',
    props: {
      initialValues: Array,
      colors: Array
  },
    data() {
      return {
        angleOffset: -90,
        chartData: [],
        colors: ["#EAD666", "#666666", "#102841", "#799E4C", "#1E4370", "#2B5FA4"],
        cx: 100,
        cy: 100,         
        radius: 80,
        sortedValues: [],
        strokeWidth: 15,
      }
    },
    computed: {
      adjustedCircumference() {
        return this.circumference - 2
      },
      circumference() {
        return 2 * Math.PI * this.radius
      },
      dataTotal() {
        return this.sortedValues.reduce((acc, val) => acc + val)
      },
      calculateChartData() {
        this.sortedValues.forEach((dataVal, index) => {
          const { x, y } = this.calculateTextCoords(dataVal, this.angleOffset)
          const data = {
            degrees: this.angleOffset,
            textX: x,
            textY: y
          }
          this.chartData.push(data)
          this.angleOffset = this.dataPercentage(dataVal) * 360 + this.angleOffset        
        })
      },
      sortInitialValues() {
        return this.sortedValues = this.initialValues.sort((a,b) => b-a).slice(0, 6);
      }
    },
    methods: {
      calculateStrokeDashOffset(dataVal, circumference) {
        const strokeDiff = this.dataPercentage(dataVal) * circumference      
        return circumference - strokeDiff
      },
      calculateTextCoords(dataVal, angleOffset) {
        const angle = (this.dataPercentage(dataVal) * 360) / 2 + angleOffset      
        const radians = this.degreesToRadians(angle)
        const textCoords = {
          x: this.radius * Math.cos(radians) + this.cx,
          y: this.radius * Math.sin(radians) + this.cy
        }
        return textCoords
      },
      degreesToRadians(angle) {
        return angle * (Math.PI / 180)
      },
      dataPercentage(dataVal) {
        return dataVal / this.dataTotal
      },
      percentageString(dataVal) {
        return `${((dataVal / this.dataTotal) * 100).toFixed(0)}%`;
      },
      returnCircleTransformValue(index) {
        return `rotate(${this.chartData[index].degrees}, ${this.cx}, ${this.cy})`
      },
      segmentBigEnough(dataVal) {
        return Math.round(this.dataPercentage(dataVal) * 100) > 5
      }    
    },
    mounted() {
      this.sortInitialValues
      this.calculateChartData
    }
  })
  new Vue({
    el: '#app',
    data() {
      return {
        values: [13, 9, 20, 3, 43, 12],
        colors: ["#EAD666", "#666666", "#102841", "#799E4C", "#1E4370", "#2B5FA4"],
      };
    },
  });
  
  Vue.component('bar-chart', {
    template: '#barChartTemplate',
    props: {
      values: Array,
      colors: Array
  },
    data() {
      return {
        barWidths: [],
        titles: ['SOLID FUEL', 'NATURAL GAS & OIL', 'IMPORTS', 'WIND', 'HYDRO & TIDAL', 'BIOMASS'],
      };
    },
    mounted() {
      this.updateBarWidths();
    },
    watch: {
      values: 'updateBarWidths',
    },
    methods: {
      updateBarWidths() {
        const total = this.values.reduce((acc, val) => parseFloat(val) + acc, 0);
        this.barWidths = this.values.map(value => (parseFloat(value) / total) * 100);
      },
    },
  });
  
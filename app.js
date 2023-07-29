/*Vue.component('bar-chart', {
  extends: VueChartJs.Bar,
  props: ['data'],
  mounted() {
    this.renderChart(this.data, {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
    });
  },
});*/
Vue.component('bar-chart', {
  extends: VueChartJs.Bar,
  props: ['data', 'chartTitle', 'xAxisLabel', 'yAxisLabel'],
  mounted() {
    this.renderChart(this.data, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
      plugins: {
        title: {
          display: true,
          text: this.chartTitle, // 您可以將標題設定為由父組件傳遞的屬性
          font: {
            size: 24, // 標題字體大小
          },
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 14, // 圖例字體大小
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: this.xAxisLabel, // 您可以將x軸單位設定為由父組件傳遞的屬性
            font: {
              size: 14, // x軸單位字體大小
            },
          },
        },
        y: {
          title: {
            display: true,
            text: this.yAxisLabel, // 您可以將y軸單位設定為由父組件傳遞的屬性
            font: {
              size: 14, // y軸單位字體大小
            },
          },
          beginAtZero: true,
          stepSize: 1,
        },
      },
    });
  },
});


// 創建 Vue 實例
const app = new Vue({
  el: "#app",
  data: {
    currentPage: 0, // 從 1 開始
    totalQuestions: 11,
    answers: {},
    message: "",
    scoreData: null,
    chartData: null, // 新增一個用於顯示長條圖的資料
    chartTitle: "回答分佈統計圖",    // 使用英文名稱並給定初始值
    xAxisLabel: "分數區間",    // 使用英文名稱並給定初始值
    yAxisLabel: "次數",    // 使用英文名稱並給定初始值
    isLoading: false,
    scoreData: {
      score: 0 // 預設值，您可以根據回傳的實際分數進行修改
    },
  },
  computed: {
    progressWidth() {
      // 根據回傳的 score 值計算進度條的寬度
      // 假設進度條的最大值為 100，您也可以根據需要進行調整
      return (this.scoreData.score / 100) * 100 + '%';
    },
  },
  methods: {
    submitForm() {
      if (this.currentPage === this.totalQuestions - 1) {
        this.isLoading = true;
        //this.message = this.answers;
        // 將所有回答從字符串轉換為數字
        for (const key in this.answers) {
          if (Object.hasOwnProperty.call(this.answers, key)) {
            this.answers[key] = parseInt(this.answers[key]);
          }
        }

        fetch("https://script.google.com/macros/s/AKfycbwmSNTmgglS5bUtqtkQPGF7MmjXOqdJpLUzL6xZm7nuQn0Wj3LHNkVh_JAj7ca20Mo/exec", {
          method: "POST",
          headers: {},
          body: JSON.stringify(this.answers),
        })
          .then((response) => response.json())
          .then((data) => {
            this.isLoading = false;
            console.log(data);
            this.currentPage++;
            //this.currentPage++;
            this.scoreData = data;
            this.prepareChartData();
          })
          .catch((error) => {
            this.isLoading = false;
            console.error("Error:", error);
            //this.message = "發生錯誤，請稍後再試。";
          });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalQuestions) {
        const currentQuestionKey = "Q" + (this.currentPage);
        if (this.currentPage!==0 && this.answers[currentQuestionKey]==null) {
          window.alert("請先回答本題再進行下一題！");
        } else {
          this.currentPage++;
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        // 設定 currentPage 的最小值為 1
        this.currentPage--;
      }
    },
    prepareChartData() {
      // 處理 scoreData 並轉換成長條圖所需的格式
      const labels = [];
      const dataValues = [];

      for (const key in this.scoreData) {
        if (!isNaN(parseInt(key)) && !isNaN(parseInt(this.scoreData[key]))) {
          labels.push(key);
          dataValues.push(this.scoreData[key]);
        }
      }

      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: '分數區間統計數量',
            backgroundColor: '#36A2EB',
            data: dataValues,
          },
        ],
      };
    },
  },
});

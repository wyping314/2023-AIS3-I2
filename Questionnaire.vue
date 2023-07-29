<template>
  <app-header></app-header> <!-- 使用 Header 組件 -->
    <div>
      <h1>問卷填寫</h1>
      <form @submit.prevent="submitForm">
        <label>
          姓名：
          <input type="text" v-model="formData.name" required />
        </label>
        <label>
          電話：
          <input type="text" v-model="formData.phone" required />
        </label>
        <label>
          地址：
          <input type="text" v-model="formData.address" required />
        </label>
        <button type="submit">提交</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          name: "",
          phone: "",
          address: "",
        },
      };
    },
    methods: {
      submitForm() {
        // 將填寫的資料送至後端處理
        fetch("https://script.google.com/macros/s/您的Google App Script專案ID/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        })
          .then((response) => response.text())
          .then((data) => {
            alert(data); // 顯示回傳的訊息
            this.formData = {}; // 清空表單資料
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("提交失敗，請稍後再試");
          });
      },
    },
  };
  </script>
  
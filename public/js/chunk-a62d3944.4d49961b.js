(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a62d3944"],{"028a":function(e,t,r){"use strict";var a=r("7127"),n=r.n(a);n.a},"2fef":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"flip-card"},[r("div",{staticClass:"flip-card-inner",class:e.loginPage?"":"signupPage"},[r("div",{staticClass:"loginForm"},[r("h1",[e._v("ورود به ترسیم")]),r("form",{staticClass:"registrationForm",on:{submit:function(t){return t.preventDefault(),e.login(t)}}},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.email,expression:"user.email"}],attrs:{type:"email",placeholder:"email"},domProps:{value:e.user.email},on:{input:function(t){t.target.composing||e.$set(e.user,"email",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.password,expression:"user.password"}],attrs:{type:"password",placeholder:"password"},domProps:{value:e.user.password},on:{input:function(t){t.target.composing||e.$set(e.user,"password",t.target.value)}}}),r("input",{staticClass:"btn btn-green",attrs:{type:"submit",value:"ورود"}})]),r("button",{on:{click:function(t){e.loginPage=!1}}},[e._v("ثبت نام")])]),r("div",{staticClass:"signupForm"},[r("h1",[e._v("ثبت نام در ترسیم")]),r("form",{staticClass:"registrationForm",on:{submit:function(t){return t.preventDefault(),e.signup(t)}}},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.email,expression:"user.email"}],attrs:{type:"email",placeholder:"email"},domProps:{value:e.user.email},on:{input:function(t){t.target.composing||e.$set(e.user,"email",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.password,expression:"user.password"}],attrs:{type:"password",placeholder:"password"},domProps:{value:e.user.password},on:{input:function(t){t.target.composing||e.$set(e.user,"password",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.rpassword,expression:"user.rpassword"}],attrs:{type:"password",placeholder:"repeat password"},domProps:{value:e.user.rpassword},on:{input:function(t){t.target.composing||e.$set(e.user,"rpassword",t.target.value)}}}),r("input",{staticClass:"btn btn-blue",attrs:{type:"submit",value:"ثبت نام"}})]),r("button",{on:{click:function(t){e.loginPage=!0}}},[e._v("قبلا ثبت نام کردم")])])])])},n=[],s=(r("4160"),r("5530")),o=(r("96cf"),r("1da1")),i={name:"app",data:function(){return{user:{email:null,password:null,rpassword:null},loginPage:!0}},methods:{signup:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.validateSignupForm()){t.next=2;break}return t.abrupt("return");case 2:return r="".concat(e.$store.state.domain,"users"),t.next=5,e.$axios.post(r,e.user).then(Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.login();case 2:case"end":return t.stop()}}),t)})))).catch((function(t){e.handleError(t)}));case 5:case"end":return t.stop()}}),t)})))()},login:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.validateLoginForm()){t.next=2;break}return t.abrupt("return");case 2:return r=Object(s["a"])({strategy:"local"},e.user),a="".concat(e.$store.state.domain,"authentication"),t.prev=3,t.next=6,e.$axios.post(a,r).then(function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(r){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=864e5,r.data.expire=(new Date).getTime()+a,localStorage.setItem("userData",JSON.stringify(r.data)),t.next=5,e.$router.push("/");case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 6:t.next=11;break;case 8:t.prev=8,t.t0=t["catch"](3),e.handleError(t.t0);case 11:case"end":return t.stop()}}),t,null,[[3,8]])})))()},handleError:function(e){var t;t="Error: Network Error"==e?"مشکل در برقراری ارتباط با سرور":"Error: Request failed with status code 409"==e?"ایمیل قبلا به ثبت رسیده است":"Error: Request failed with status code 401"==e?"ایمیل یا رمز عبور اشتباه است":e,this.sendError(t)},sendError:function(e){this.$toasted.error(e,{position:"bottom-left",duration:5e3,keepOnHover:!0,iconPack:"fontawesome",icon:"fa-close"})},validEmail:function(e){var t=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return t.test(e)},validLength:function(e){if(e.length>=3)return!0},validateLoginForm:function(){var e=this,t=this.user,r=[];return this.validEmail(t.email)||r.push("ایمیل معتبر نمیباشد"),this.validLength(t.password)||r.push("پسورد به اندازه کافی قوی نیست"),!r.length||(r.forEach((function(t){e.sendError(t)})),!1)},validateSignupForm:function(){var e=this,t=this.user,r=[];return this.validEmail(t.email)||r.push("ایمیل معتبر نمیباشد"),this.validLength(t.password)||r.push("پسورد به اندازه کافی قوی نیست"),t.password!==t.rpassword&&r.push("فیلد های پسورد یکسان نیستند"),!r.length||(r.forEach((function(t){e.sendError(t)})),!1)}},computed:{},mounted:function(){}},u=i,l=(r("028a"),r("2877")),c=Object(l["a"])(u,a,n,!1,null,null,null);t["default"]=c.exports},7127:function(e,t,r){}}]);
//# sourceMappingURL=chunk-a62d3944.4d49961b.js.map
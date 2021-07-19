var e=Object.defineProperty,l=Object.defineProperties,a=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable,o=(l,a,t)=>a in l?e(l,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[a]=t,n=(e,l)=>{for(var a in l||(l={}))s.call(l,a)&&o(e,a,l[a]);if(t)for(var a of t(l))u.call(l,a)&&o(e,a,l[a]);return e};import{_ as i,d as r,n as c,o as d,c as v,m as p,F as f,r as y,a as g,u as m,b as h,e as w,f as _,w as b,g as x,N as k,h as C,T as j,i as U,j as P,k as z,l as S,A as O,C as T,p as L,P as $,q as F,s as A,S as I,t as H,v as M,x as D,y as R,B,z as E,D as N,E as q,G,H as V,I as X,J as Y,K as J,L as K,M as Q,O as W,Q as Z,R as ee,U as le,V as ae,W as te,X as se,Y as ue,Z as oe,$ as ne,a0 as ie}from"./vendor.acadc03f.js";const re={show:{type:Boolean,required:!0},vanish:Function,resolve:Function,reject:Function},ce=i.props;var de=r({props:n(n({},re),ce),setup:(e,{emit:l})=>{const a=e.show;a.value&&(a.value=!1,c((()=>a.value=!0)));return{props:e,onClone:()=>{var l,t;null==(l=e.reject)||l.call(e),a.value=!1,null==(t=e.vanish)||t.call(e)},onConfirm:()=>{var l,t;null==(l=e.resolve)||l.call(e),a.value=!1,null==(t=e.vanish)||t.call(e)},show:a}}});de.render=function(e,l,a,t,s,u){const o=i;return d(),v(o,p({preset:"dialog"},e.props,{show:e.show,"onUpdate:show":l[1]||(l[1]=l=>e.show=l),onPositiveClick:e.onConfirm,onNegativeClick:e.onClone}),null,16,["show","onPositiveClick","onNegativeClick"])};const ve=e=>new Promise(((t,s)=>{var u,o;f.renderInstance(de,(u=n({},e),o={show:y(!0),resolve:t,reject:s},l(u,a(o))))})),pe={class:"mr-24 flex flex-col items-center"},fe=D(" 新增分组 "),ye={class:"mb-12"},ge=D("点击或者拖动文件到该区域来上传至当前分组"),me={class:"mt-12"},he=_("span",null,"单独写入 Svg ",-1),we={class:"flex justify-between"},_e=_("span",null,"导出 Fonts",-1),be=D("全选"),xe=D("删除"),ke=D("移动"),Ce=D("导入 SVG 是否保留颜色"),je={class:"mt-20 flex-1"},Ue={class:"grid gap-24",style:{"grid-template-columns":"repeat(auto-fill, 112px)"}},Pe={class:"flex justify-end"},ze=D("取消"),Se=D("确认"),Oe={class:"flex justify-end"},Te=D("取消"),Le=D("确认"),$e={class:"flex justify-end"},Fe=D("取消"),Ae=D("确认"),Ie={class:"grid gap-24 w-full",style:{"grid-template-columns":"repeat(auto-fill, 112px)"}},He={class:"flex justify-end"},Me=D("取消"),De=D("确认");var Re=r({setup(e){g.defaults.loading=!0;const l=m();let a;f.axiosLoading(g,(()=>{a||(a=l.loading("加载中....",{duration:0}))}),(()=>{a&&(a.destroy(),a=void 0)}));const t=y(0),s=y([{label:"全部",key:0},{label:"未分组",key:1e4}]),u=y([]),o=y([]),n=h((()=>[...s.value,...u.value])),r=()=>{Ne()},p=y({text:""}),ue=y({key:"",value:"",group:void 0}),oe=y({group:void 0}),ne=y({label:""}),ie=y({prefix:""}),re=y(!0),ce=y(!1),de=y(!1),Re=y(!1),Be=y(!1),{list:Ee,resetList:Ne}=f.useListPagination({getList:async()=>{const{data:e}=await g.get("/json/fonts",{params:t.value&&{group:t.value}});return e},sources:[()=>p.value,()=>t.value]}),{selectItems:qe,isSelectAll:Ge}=f.useMultipleSelect(Ee),{selectItems:Ve}=f.useMultipleSelect(o),Xe=h((()=>qe.value.map((e=>e.id)))),Ye=async()=>{Ve.value.length||l.warning("请选择分组!");const{data:e}=await g.get("/out-fonts",{params:{prefix:ie.value.prefix,ids:Ve.value.map((e=>e.value))},responseType:"arraybuffer"});((e,l)=>{const a=new Blob([e]),t=window.URL.createObjectURL(a),s=document.createElement("a");s.style.display="none",s.href=t,s.setAttribute("download",`${l}.zip`),document.body.appendChild(s),s.click()})(e,"iconfont")},Je=async()=>{const{data:e}=await g.get("/json/group");u.value=e.map((e=>({label:()=>_("div",{class:"flex items-center justify-between"},[_(k,{style:"max-width: 90px;"},{default:()=>[_("span",null,[e.label])]}),_(C,{class:"-mt-4",size:"15px",onClick:l=>{Ke(e),l.stopPropagation()}},{default:()=>[_(j,null,null)]})]),key:e.id}))),o.value=[{label:"未分组",value:1e4,select:!0},...e.map((e=>({select:!0,label:e.label,value:e.id})))]},Ke=async e=>{await ve({preset:"dialog",type:"warning",title:"提示",content:"你确定要删除该分组吗？",positiveText:"确定",negativeText:"不确定"}),await g.delete(`/json/group/${e.id}`);const{data:a}=await g.get("/json/fonts");await Promise.all(a.filter((l=>l.group===e.id)).map((e=>g.delete(`/json/fonts/${e.id}`)))),await Je(),l.success("删除成功!")},Qe=async e=>{const a=e||Xe.value;await ve({preset:"dialog",type:"warning",title:"提示",content:`你确定要删除当前 ${a.length} 項图标吗？`,positiveText:"确定",negativeText:"不确定"}),await Promise.all(a.map((e=>g.delete(`/json/fonts/${e}`)))),await Ne(),l.success("删除成功!")},We=async()=>{const e=R.exports.cloneDeep(ue.value);return e.value=e.value.replace(/\n/g,"").replace(/width="(\w*%?)"/g,"").replace(/height="(\w*%?)"/g,"").trim(),re.value||(e.value=f.setHtmlStrTagAttr({html:e.value,tag:"path",attr:"fill",value:"currentColor"}),e.value=f.setHtmlStrTagAttr({html:e.value,tag:"svg",attr:"fill",value:"currentColor"})),e.key?/^<svg.*>.*<\/svg>/.test(e.value)?(e.group=e.group||t.value||1e4,await g.post("/json/fonts",e),R.exports.forIn(ue.value,((e,l)=>ue.value[l]="")),ue.value.group=void 0,ce.value=!1,await Ne(),void l.success("添加成功!")):l.error("内容不符合 svg 标签格式"):l.error("名称不能为空")},Ze=async()=>{await Promise.all(Xe.value.map((e=>g.patch(`/json/fonts/${e}`,oe.value)))),await Ne(),l.success("移动成功!"),de.value=!1},el=async()=>{await g.post("/json/group",ne.value),await Je(),l.success("添加成功!"),Re.value=!1};w((()=>Je()));const ll=y(),al=y([{label:"复制",key:"copy"},{label:"删除",key:"delete"}]),tl=y(!1),sl=y([0,0]),ul=async e=>{var a,t;if("copy"===e){const{copy:e}=U();await e((null==(a=ll.value)?void 0:a.key)||""),l.success(`复制 ${null==(t=ll.value)?void 0:t.key} 成功`)}"delete"===e&&Qe([ll.value.id]),tl.value=!1};return(e,l)=>{const a=B,s=E,u=N,f=q,y=G,g=V,m=X,h=Y,w=J,j=se,U=K,R=Q,ve=W,Ne=P,qe=Z,Ve=ee,Xe=le,Je=i,Ke=z;return d(),v(x,null,[_(Ne,{class:"rounded-3xl",title:"Fonts Administration",style:{height:"calc(100vh - 50px)","min-height":"470px"},bordered:!1},{default:b((()=>[_(ve,{"has-sider":"",class:"h-full"},{default:b((()=>[_(u,{width:176,bordered:""},{default:b((()=>[_("div",pe,[_(a,{class:"my-24 w-128",type:"primary",onClick:l[1]||(l[1]=e=>Re.value=!0)},{icon:b((()=>[_(S(C),null,{default:b((()=>[_(S(O))])),_:1})])),default:b((()=>[fe])),_:1}),_(s,{class:"w-full",value:t.value,"onUpdate:value":l[2]||(l[2]=e=>t.value=e),options:S(n)},null,8,["value","options"])])])),_:1}),_(R,{class:"ml-24","content-style":"display: flex; flex-direction: column;height:100%","native-scrollbar":!1},{default:b((()=>[_(g,{class:"mb-12",action:"/upload-svgs",accept:".svg",name:"files","default-upload":!0,multiple:!0,data:{group:String(t.value||1e4),isRetainColor:String(re.value)},onFinish:r},{default:b((()=>[_(y,null,{default:b((()=>[_("div",ye,[_(S(C),{size:"48",depth:3},{default:b((()=>[_(S(T))])),_:1})]),_(f,{class:"text-sm"},{default:b((()=>[ge])),_:1}),_("div",me,[_(a,{class:"w-128",type:"primary",onClick:l[3]||(l[3]=L((e=>ce.value=!0),["stop"]))},{default:b((()=>[_(S(C),{class:"mr-2"},{default:b((()=>[_(S($))])),_:1}),he])),_:1})])])),_:1})])),_:1},8,["data"]),_("div",we,[_(h,{class:"items-center leading-none",size:"large"},{default:b((()=>[_(a,{class:"w-128",type:"primary",onClick:l[4]||(l[4]=e=>Be.value=!0)},{default:b((()=>[_(S(C),{class:"mr-2"},{default:b((()=>[_(S(F))])),_:1}),_e])),_:1}),_(m,{checked:S(Ge),"onUpdate:checked":l[5]||(l[5]=e=>A(Ge)?Ge.value=e:null)},{default:b((()=>[be])),_:1},8,["checked"]),_(a,{text:"",onClick:l[6]||(l[6]=e=>Qe())},{default:b((()=>[xe])),_:1}),_(a,{text:"",onClick:l[7]||(l[7]=e=>de.value=!0)},{default:b((()=>[ke])),_:1}),_(m,{checked:re.value,"onUpdate:checked":l[8]||(l[8]=e=>re.value=e)},{default:b((()=>[Ce])),_:1},8,["checked"])])),_:1}),_(w,{class:"w-160",placeholder:"查询图标",value:p.value.text,"onUpdate:value":l[9]||(l[9]=e=>p.value.text=e),round:""},{suffix:b((()=>[_(S(C),{class:"cursor-pointer"},{default:b((()=>[_(S(I))])),_:1})])),_:1},8,["value"])]),_("div",je,[_("div",Ue,[(d(!0),v(x,null,H(S(Ee),((e,l)=>(d(),v(j,{key:l,onClick:l=>e.select=!e.select,onContextmenu:l=>((async e=>{e.preventDefault(),await c(),tl.value=!0,sl.value[0]=e.clientX,sl.value[1]=e.clientY})(l),ll.value=e),class:[[e.select?"bg-gray-50 border border-primary text-primary":""],"cn-font__item"],tag:"div"},{default:b((()=>[_(S(C),{size:"35",class:"hover:text-primary transition-all duration-200"},{default:b((()=>[_("div",{class:"inline-block",innerHTML:e.value},null,8,["innerHTML"])])),_:2},1024),_(j,{tag:"div",class:"select-none"},{default:b((()=>[_(S(k),{class:"max-w-80"},{default:b((()=>[D(ae(e.key),1)])),_:2},1024)])),_:2},1024)])),_:2},1032,["onClick","onContextmenu","class"])))),128))]),S(Ee).length?M("",!0):(d(),v(U,{key:0,class:"h-full flex justify-center",description:"你什么也找不到",size:"huge"}))])])),_:1})])),_:1})])),_:1}),_(Je,{show:ce.value,"onUpdate:show":l[14]||(l[14]=e=>ce.value=e),preset:"card",style:{width:"600px"},title:"新增 svg",size:"huge",bordered:!1},{default:b((()=>[_(Xe,{"label-placement":"left"},{default:b((()=>[_(qe,{label:"名称",path:"key"},{default:b((()=>[_(w,{placeholder:"请输入 svg 名称",value:ue.value.key,"onUpdate:value":l[10]||(l[10]=e=>ue.value.key=e)},null,8,["value"])])),_:1}),_(qe,{label:"内容",path:"key"},{default:b((()=>[_(w,{class:"h-112",value:ue.value.value,"onUpdate:value":l[11]||(l[11]=e=>ue.value.value=e),type:"textarea",placeholder:"请输入 svg 标签"},null,8,["value"])])),_:1}),_(qe,{label:"分组"},{default:b((()=>[_(Ve,{placeholder:"请选择分组(默认当前分组)",value:ue.value.group,"onUpdate:value":l[12]||(l[12]=e=>ue.value.group=e),options:o.value},null,8,["value","options"])])),_:1})])),_:1}),_("div",Pe,[_(h,null,{default:b((()=>[_(a,{class:"w-112",onClick:l[13]||(l[13]=e=>ce.value=!1)},{default:b((()=>[ze])),_:1}),_(a,{type:"primary",class:"w-112",onClick:We},{default:b((()=>[Se])),_:1})])),_:1})])])),_:1},8,["show"]),_(Je,{show:de.value,"onUpdate:show":l[17]||(l[17]=e=>de.value=e),preset:"card",style:{width:"600px"},title:"移动分组",size:"huge",bordered:!1},{default:b((()=>[_(Xe,{class:"mb-24","label-placement":"left"},{default:b((()=>[_(qe,{label:"分组"},{default:b((()=>[_(Ve,{placeholder:"请选择分组",value:oe.value.group,"onUpdate:value":l[15]||(l[15]=e=>oe.value.group=e),options:o.value},null,8,["value","options"])])),_:1})])),_:1}),_("div",Oe,[_(h,null,{default:b((()=>[_(a,{class:"w-112",onClick:l[16]||(l[16]=e=>de.value=!1)},{default:b((()=>[Te])),_:1}),_(a,{type:"primary",class:"w-112",onClick:Ze},{default:b((()=>[Le])),_:1})])),_:1})])])),_:1},8,["show"]),_(Je,{show:Re.value,"onUpdate:show":l[20]||(l[20]=e=>Re.value=e),preset:"card",style:{width:"600px"},title:"新增分组",size:"huge",bordered:!1},{default:b((()=>[_(Xe,{class:"mb-24","label-placement":"left"},{default:b((()=>[_(qe,{label:"名称"},{default:b((()=>[_(w,{placeholder:"请输入分组名称",value:ne.value.label,"onUpdate:value":l[18]||(l[18]=e=>ne.value.label=e)},null,8,["value"])])),_:1})])),_:1}),_("div",$e,[_(h,null,{default:b((()=>[_(a,{class:"w-112",onClick:l[19]||(l[19]=e=>Re.value=!1)},{default:b((()=>[Fe])),_:1}),_(a,{type:"primary",class:"w-112",onClick:el},{default:b((()=>[Ae])),_:1})])),_:1})])])),_:1},8,["show"]),_(Je,{show:Be.value,"onUpdate:show":l[23]||(l[23]=e=>Be.value=e),preset:"card",style:{width:"600px"},title:"导出 fonts",size:"huge",bordered:!1},{default:b((()=>[_(Xe,{class:"mb-24"},{default:b((()=>[_(qe,{label:"导出 css 前缀"},{default:b((()=>[_(w,{placeholder:"请输入前缀（ 默认 'iconfont' ）",value:ie.value.prefix,"onUpdate:value":l[21]||(l[21]=e=>ie.value.prefix=e)},null,8,["value"])])),_:1}),_(qe,{label:"选择分组"},{default:b((()=>[_("div",Ie,[(d(!0),v(x,null,H(o.value,((e,l)=>(d(),v(j,{key:l,onClick:l=>e.select=!e.select,class:[[e.select?"bg-gray-50 border border-primary text-primary":""],"cn-font__item"],tag:"div"},{default:b((()=>[_(S(C),{size:"35",class:"hover:text-primary transition-all duration-200"},{default:b((()=>[_(S(te))])),_:1}),_(j,{tag:"div",class:"select-none mt-1"},{default:b((()=>[_(S(k),{style:{"max-width":"80px"}},{default:b((()=>[D(ae(e.label),1)])),_:2},1024)])),_:2},1024)])),_:2},1032,["onClick","class"])))),128))])])),_:1}),_("div",He,[_(h,null,{default:b((()=>[_(a,{class:"w-112",onClick:l[22]||(l[22]=e=>Be.value=!1)},{default:b((()=>[Me])),_:1}),_(a,{type:"primary",class:"w-112",onClick:Ye},{default:b((()=>[De])),_:1})])),_:1})])])),_:1})])),_:1},8,["show"]),_(Ke,{placement:"bottom-start",onSelect:ul,x:sl.value[0],y:sl.value[1],options:al.value,show:tl.value,"on-clickoutside":()=>tl.value=!1},null,8,["x","y","options","show","on-clickoutside"])],64)}}});ie(r({setup:e=>(e,l)=>{const a=oe,t=ne,s=ue;return d(),v(s,{class:"xl:container"},{default:b((()=>[_(t,null,{default:b((()=>[_(a,null,{default:b((()=>[_(Re)])),_:1})])),_:1})])),_:1})}})).mount("#app");
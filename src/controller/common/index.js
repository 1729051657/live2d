// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
var menu=new Menu("#myMenu");
var item1=new Item("fenleiorguangchangorqita","首页");
var item3=new Item("xiaoxi","你好","/bar","#5CD1FF");
menu.add(item1);
menu.add(item3);

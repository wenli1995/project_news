export default function LoadingReducer(preState={isLoading:true},action){
 const {type,value}=action;
 switch(type){
     case "change-loading":
         let newState={...preState}  /* 直接修改preState状态变化吗 */
         /* 结构赋值和直接赋值的区别在于，前者是创建了一个新对象并指向这个新对象 */
         newState.isLoading=value  
         return newState
     default:
         return preState

 }
}
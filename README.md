# 更新日志
> 我们对每次的修复做了详细记录

## 2018.08.18（FZS）
1. 跟新了批量上传数量为50条每次
2. 修复上传进度小数位无限循环的bug

## 2017.08.29（FZS）
1. 修复了多次弹出重新登录提示的bug

## 2017.08.28（FZS）
1. 新增导出CSV记录功能
2. 优化登录超时的体验

## 2017.08.26（FZS）
1. 新增导出CSV请求功能

## 2017.08.25（FZS）
1. 新增导出CSV设置功能

## 2017.08.24（FZS）
1. 新增导出库存Excel功能
2. 将 src/pages/stock/setting 修改为 src/pages/stock/warehouse
3. 删除了 routes.js 中 的 path: '/stock/book'

## 2017.08.23（WK）
1. 添加出库语音提醒

## 2017.08.22（FZS）
1. 美化了登录页面

## 2017.08.21（FZS）
1. 操作记录请求增加了loading
2. 单本上架增加了loading，禁止重复点击入库
3. 修改了信息页面跳转详情的route
4. 操作记录页面导出功能对时间做了限定
5. 生产环境屏蔽异常信息

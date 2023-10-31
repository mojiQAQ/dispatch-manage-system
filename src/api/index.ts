import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

// 查询所有订单
export const getOrdersAPI = (openid: string) => {
    return request({
        url: `/orders?openid=${openid}`,
        method: 'GET'
    })
};

// 查询订单详情
export const getOrderInfoAPI = (openid: string, order_id: Number) => {
    return request({
        url: `/orders/${order_id}?openid=${openid}`,
        method: 'GET'
    })
};

// 查询子订单列表
export const getSubOrdersAPI = (openid: string, order_id: Number) => {
    return request({
        url: `/orders/${order_id}/sub_orders?openid=${openid}`,
        method: 'GET'
    })
};

// 查询子订单详情
export const getSubOrderInfoAPI = (openid: string, order_id: Number, sub_order_id: Number) => {
    return request({
        url: `/orders/${order_id}/sub_orders/${sub_order_id}?openid=${openid}`,
        method: 'GET'
    })
};

// 审核子订单
export const reviewSubOrderAPI = (openid: string, order_id: Number, sub_order_id: Number, state: Number) => {
    return request({
        url: `/orders/${order_id}/sub_orders/${sub_order_id}?openid=${openid}&state=${state}`,
        method: 'PUT'
    })
};




// 查询用户列表
export const getUsersAPI = () => {
    return request({
        url: `/users`,
        method: 'GET'
    })
};

// 查询交易记录
export const getTradesAPI = (uuid: string, user_id: Number, type: Number) => {
    return request({
        url: `/trades`,
        params: {
            uuid: uuid,
            user_id: user_id,
            type: type
        },
        method: 'GET'
    })
};

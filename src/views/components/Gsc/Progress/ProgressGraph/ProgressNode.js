import {defineComponent, h} from "vue";
import Automatic from "./Automatic.vue";
import Condition from "./Condition.vue";
import Audit from "./Audit.vue";
import Hook from "./Hook.vue";

const normalPortColor = '#31d0c6'
const conditionPortColor = '#e6a23c'

const portStyle = (magnet, stroke, text) => {
    let rs = {
        circle: {
            r: 6,
            magnet,
            stroke,
            strokeWidth: 2,
            fill: '#fff',
        }
    }

    // if (text) {
    //     rs.text = {
    //         text,
    //         fill: '#73767a'
    //     }
    // }

    return rs;
}

/**
 * 获取自动处理节点
 * @param attr  节点属性
 * @param props 组件参数
 * @returns {any|VNode}
 */
const getAutomaticNode = (attr, props) => {
    return Object.assign({}, attr, {
        width: 220,
        height: 130,
        inherit: 'vue-shape',
        component: defineComponent({
            render() {
                return h(
                    Automatic,
                    props
                )
            }
        }),
        ports: {
            groups: {
                in: {
                    position: 'left',
                    attrs: portStyle('passive', normalPortColor)
                },
                // 输出链接桩群组定义
                out: {
                    position: 'right',
                    attrs: portStyle(true, normalPortColor)
                },
                'condition-in': {
                    position: 'top',
                    attrs: portStyle('passive', conditionPortColor)
                }
            },
            items: [
                {
                    group: 'in',
                },
                {
                    group: 'out',
                },
                {
                    group: 'condition-in',
                    tip: '条件跳转入口',
                },
            ]
        },
    })
}

/**
 * 获取审批节点
 * @param attr  节点属性
 * @param props 组件参数
 * @returns {any|VNode}
 */
const getAuditNode = (attr, props) => {
    return Object.assign({}, attr, {
        width: 215,
        height: 125,
        inherit: 'vue-shape',
        component: defineComponent({
            render() {
                return h(
                    Audit,
                    props
                )
            }
        }),
        ports: {
            groups: {
                in: {
                    position: 'left',
                    attrs: portStyle('passive', normalPortColor)
                },
                // 输出链接桩群组定义
                out: {
                    position: 'right',
                    attrs: portStyle(true, normalPortColor)
                },
                'condition-in': {
                    position: 'top',
                    attrs: portStyle('passive', conditionPortColor)
                }
            },
            items: [
                {
                    group: 'in',
                },
                {
                    group: 'out',
                },
                {
                    group: 'condition-in',
                    tip: '条件跳转入口',
                },
            ]
        },
    })
}

/**
 * 获取Hook节点
 * @param attr  节点属性
 * @param props 组件参数
 * @returns {any|VNode}
 */
const getHookNode = (attr, props) => {
    return Object.assign({}, attr, {
        width: 225,
        height: 85,
        inherit: 'vue-shape',
        component: defineComponent({
            render() {
                return h(
                    Hook,
                    props
                )
            }
        }),
        ports: {
            groups: {
                in: {
                    position: 'left',
                    attrs: portStyle('passive', normalPortColor)
                },
                // 输出链接桩群组定义
                out: {
                    position: 'right',
                    attrs: portStyle(true, normalPortColor)
                },
                'condition-in': {
                    position: 'top',
                    attrs: portStyle('passive', conditionPortColor)
                }
            },
            items: [
                {
                    group: 'in',
                },
                {
                    group: 'out',
                },
                {
                    group: 'condition-in',
                    tip: '条件跳转入口',
                },
            ]
        },
    })
}

/**
 * 获取人工处理节点
 * @param attr
 * @param props
 * @returns {any|VNode}
 */
const getConditionNode = (attr, props) => {
    return Object.assign({}, attr, {
        width: 200,
        height: 200,
        inherit: 'vue-shape',
        component: defineComponent({
            render() {
                return h(
                    Condition,
                    props
                )
            }
        }),
        ports: {
            groups: {
                in: {
                    position: 'left',
                    attrs: portStyle('passive', normalPortColor)
                },
                // 输出链接桩群组定义
                out: {
                    position: 'right',
                    // 标签位置
                    label: {position: 'right'},
                    attrs: portStyle(true, normalPortColor)
                },
                // 输出链接桩群组定义
                'condition-out': {
                    position: 'top',
                    // 标签位置
                    label: {position: 'top'},
                    attrs: portStyle(true, conditionPortColor)
                }
            },
            items: [
                {
                    group: 'in',
                },
                {
                    group: 'out',
                    tip: '成功',
                },
                {
                    group: 'condition-out',
                    tip: '失败',
                },
            ]
        },
    })
}

export default {
    getNode(name, attr, props) {
        switch (name) {
            case 'Automatic':
                return getAutomaticNode(attr, props)
            case 'Condition':
                return getConditionNode(attr, props)
            case 'Audit':
                return getAuditNode(attr, props)
            case 'Hook':
                return getHookNode(attr, props)
        }
    }
}
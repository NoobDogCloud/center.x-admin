// import Automatic from './Automatic'
import ProgressNode from './ProgressNode'
import * as NodeData from './NodeData'
import {Addon, Graph, Shape} from "@antv/x6";

//边样式配置
const edgeStyle = {
    line: {
        stroke: '#1890ff',
        strokeDasharray: 5,
        targetMarker: 'classic',
        style: {
            animation: 'ant-line 30s infinite linear',
        },
    },
}

//高亮配置
const highlighting = {
    magnetAvailable: {
        name: 'stroke',
        args: {
            attrs: {
                fill: '#fff',
                stroke: '#f89898',
            },
        },
    },
    magnetAdsorbed: {
        name: 'stroke',
        args: {
            attrs: {
                fill: '#fff',
                stroke: '#F56C6C',
            },
        },
    },
}

export default class ProgressGraph {
    graph = null

    constructor(graphContainer) {
        this.graph = new Graph({
            container: graphContainer,
            width: '100%',
            height: '100%',
            //滚轮缩放
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: 'ctrl',
                minScale: 0.5,
                maxScale: 3,
            },
            //平移
            panning: {
                enabled: true,
                modifiers: 'ctrl',
            },
            history: true,
            selecting: {
                enabled: true,
                rubberband: true,
                showNodeSelectionBox: true,
            },
            resizing: {
                preserveAspectRatio: true,
                enabled: true
            },
            keyboard: true,
            clipboard: true,
            snapline: {
                enabled: true,
            },
            onPortRendered: ({contentContainer, port, node}) => {
                const text = node.portProp(port.id, 'tip')
                this.registerPortTooltip(contentContainer, text)
            },
            //高亮配置
            highlighting,
            restrict: true,
            //连接策略配置
            connecting: this.#getConnectingConfig()
        })
        //注册节点
        this.registerNode();
        //注册工具
        this.#initTool()
        //注册快捷键
        this.#initKeyboard()
        //注册dnd窗口
        // this.#initStencil(stencilContainer)
    }

    registerPortTooltip = (container, text) => {
        if (text) {
            container.addEventListener('mouseenter', (e) => {
                const tooltip = document.querySelector('.tool-tip')
                const content = tooltip?.querySelector('p')
                if (content) {
                    content.innerText = text
                    tooltip.style.left = `${e.clientX - 10 - content.offsetWidth / 2}px`
                    tooltip.style.top = `${e.clientY - 50}px`
                }
            })
            container.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tool-tip')
                tooltip.style.left = '-1000px'
                tooltip.style.top = '-1000px'
            })
        }
    }

    /**
     * 初始化dnd窗口
     */
    initStencil(stencilContainer) {
        this.stencil = new Addon.Stencil({
            title: '流程图',
            target: this.graph,
            stencilGraphWidth: 220,
            stencilGraphHeight: 800,
            collapsable: false,
            groups: [
                {
                    title: '基础图形',
                    name: 'group1',
                }
            ],
            layoutOptions: {
                columns: 1,
                columnWidth: 200,
                rowHeight: 130,
            },
        })
        stencilContainer.appendChild(this.stencil.container)
        this.#initStencilNode(stencilContainer);
    }

    /**
     * 初始化dnd节点
     */
    #initStencilNode(stencilContainer) {
        const r1 = this.graph.createNode({
            shape: 'Automatic',
            data: NodeData['Automatic']()
        })
        const r2 = this.graph.createNode({
            shape: 'Audit',
            data: NodeData['Audit']()
        })
        const r3 = this.graph.createNode({
            shape: 'Condition',
            data: NodeData['Condition'](),
            width: 160,
            height: 160
        })
        const r4 = this.graph.createNode({
            shape: 'Hook',
            data: NodeData['Hook']()
        })
        this.stencil.load([r1, r2, r3, r4], 'group1')
        const container = stencilContainer
        const ports = container.querySelectorAll(
            '.x6-port-body',
        )
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
            ports[i].style.visibility = 'hidden'
        }
    }

    /**
     * 初始化键盘快捷键
     */
    #initKeyboard() {
        this.graph.bindKey(['meta+x', 'ctrl+x'], () => {
            const cells = this.graph.getSelectedCells()
            if (cells.length) {
                this.graph.cut(cells)
            }
            return false
        })
        this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
            if (this.graph.history.canUndo()) {
                this.graph.history.undo()
            }
            return false
        })
        this.graph.bindKey(['meta+y', 'ctrl+y'], () => {
            if (this.graph.history.canRedo()) {
                this.graph.history.redo()
            }
            return false
        })
        this.graph.bindKey('delete', () => {
            const cells = this.graph.getSelectedCells()
            if (cells.length) {
                this.graph.removeCells(cells)
            }
        })
    }

    /**
     * 初始化画布工具
     */
    #initTool() {
        this.graph.on('edge:mouseenter', ({cell}) => {
            cell.addTools([
                {
                    name: 'button-remove'
                },
                {
                    name: 'target-arrowhead',
                    args: {
                        attrs: {
                            fill: '#2097f6',
                            stroke: '#fff',
                            'stroke-width': 1,
                            cursor: 'move'
                        }
                    },
                },
            ])
        })

        this.graph.on('edge:mouseleave', ({cell}) => {
            cell.removeTools()
        })
    }

    /**
     *  节点连接策略配置
     */
    #getConnectingConfig() {
        return {
            snap: {
                radius: 25,
            },
            highlight: true,
            allowBlank: false,
            allowMulti: false,
            allowLoop: false,
            allowNode: false,
            allowEdge: false,
            createEdge() {
                return new Shape.Edge({attrs: edgeStyle})
            },
            connector: {name: 'rounded', args: {radius: 40}},
            connectionPoint: 'boundary',
            router: {name: 'manhattan', args: {step: 20}},
            validateConnection: this.#validateConnection.bind(this)
        }
    }

    /**
     * 递归查询是否存在环路
     * @param sourceView
     * @param targetView
     */
    #getLoopView(source, target, validateObj) {
        const outgoingEdges = this.graph.getOutgoingEdges(target) || []
        if (outgoingEdges.length == 0) {
            return true;
        }
        if (validateObj.targetMagnet.getAttribute('port-group') === 'condition-in') {
            return true
        }

        let t = outgoingEdges.find(v => {
            if (target.getPort(v.getSourcePortId()).group !== 'condition-out') {
                return true
            }
        })
        //忽略仅存在condition-out类型的出口连线
        if (!t) {
            return true;
        }
        t = t.getTargetNode();
        if (t && t.id === source.id) {
            return false;
        } else {
            return this.#getLoopView(source, t, validateObj)
        }
        return true;
    }

    /**
     * 校验所有port是否可以连接,可以连接的高亮显示
     * @param sourceView
     * @param targetView
     * @param targetMagnet
     * @returns {boolean|*}
     */
    #validateConnection(v) {
        const {sourceView, targetView, targetMagnet, sourcePort, sourceMagnet} = v;

        //同一port只允许一条连线
        const outgoingEdges = this.graph.getOutgoingEdges(sourceView.cell);
        if (outgoingEdges && outgoingEdges.length > 1) {
            const outEdge = outgoingEdges.find(v => v.getSourcePortId() == sourcePort)
            //存在出口port,既非当前source连线而是事件触发之前就已经存在的Edge
            if (outEdge.getTargetPortId()) {
                return false;
            }
        }

        //条件out-port只允许连接条件in-port
        if (sourceMagnet.getAttribute('port-group') === 'condition-out' && targetMagnet.getAttribute('port-group') !== 'condition-in') {
            return false;
        }

        //非条件port不允许连接条件port
        if (sourceMagnet.getAttribute('port-group') !== 'condition-out' && (targetMagnet.getAttribute('port-group') === 'condition-in' || targetMagnet.getAttribute('port-group') === 'condition-out')) {
            return false;
        }

        //不允许空白连线
        if (!targetMagnet) {
            return false
        }

        //out不允许接入连线
        if (targetMagnet.getAttribute('port-group') === 'out') {
            return false
        }

        /**
         * 不允许循环连接
         * 例如A-B-C-D的情况下不允许D-A的连接
         */
        if (targetView) {
            const node = targetView.cell
            const portId = targetMagnet.getAttribute('port')
            const incomingEdges = this.graph.getIncomingEdges(node) || []

            //获取已使用的port
            const usedInPorts = incomingEdges.map((edge) => {
                const portId = edge.getTargetPortId()
                return node.getPort(portId)
            })

            //如果已使用的port可以找到当前port,则代表port已使用,跳过
            if (usedInPorts.find((port) => port && port.id === portId)) {
                // if (incomingEdges.length > 0) {
                return false
            } else {
                return this.#getLoopView(sourceView.cell, targetView.cell, v)
            }
        }

        return true
    }

    /**
     * 获取node配置
     * @param arg
     * @returns {*|VNode}
     */
    getNode(...arg) {
        return ProgressNode.getNode(...arg)
    }

    /**
     * 注册节点
     */
    registerNode() {
        Graph.registerNode('Automatic', this.getNode('Automatic', {}, {type: 'default'}), true);
        Graph.registerNode('Audit', this.getNode('Audit'), true);
        Graph.registerNode('Condition', this.getNode('Condition'), true);
        Graph.registerNode('Hook', this.getNode('Hook'), true);
    }

    /**
     * 获取边配置
     * @param source
     * @param target
     * @returns {{source, target, attrs: {line: {strokeWidth: number, targetMarker: {size: number, name: string}, stroke: string}}}}
     */
    getEdge(source, target) {
        return {
            source, // String，必须，起始节点 id
            target, // String，必须，目标节点 id
            attrs: edgeStyle
        }
    }
};

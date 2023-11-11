<template>
    <div class="deploy-detail-box">
        <div class="detail-area">
            <p class="detail-title">基础信息</p>
            <div class="detail-content">
                <div class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>目标应用:</span>
                    </label>
                    <span class="content">{{ appname }}</span>
                </div>
                <div class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>部署名称:</span>
                    </label>
                    <span class="content">{{ props.payload.name }}</span>
                </div>
                <div class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>业务名称:</span>
                    </label>
                    <span class="content">{{ props.payload.text }}</span>
                </div>
                <div class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>调试:</span>
                    </label>
                    <span :class="props.payload.debug === 1 ? 'success' : 'error'" class="content">
                        {{ props.payload.debug === 1 ? '是' : '否' }}
                    </span>
                </div>
                <!--                <div class='detail-item'>-->
                <!--                    <label class='label'>-->
                <!--                        <el-icon :size='18'>-->
                <!--                            <svg-icon name='akar-icons:shipping-box-01'></svg-icon>-->
                <!--                        </el-icon>-->
                <!--                        <span>部署状态:</span>-->
                <!--                    </label>-->
                <!--                    <span class='content' :class='{-->
                <!--                    success: props.payload.state == 1 || props.payload.state == 20,-->
                <!--                    warning:props.payload.state == 2,-->
                <!--                    danger:props.payload.state !== 1 && props.payload.state !== 20 && props.payload.state !== 2-->
                <!--                }'-->
                <!--                    >-->
                <!--                    {{ statename }}-->
                <!--                </span>-->
                <!--                </div>-->
                <div class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>部署数量:</span>
                    </label>
                    <span class="content">{{ props.payload.replicaset }}</span>
                </div>
                <div class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>发布方式:</span>
                    </label>
                    <span class="content">{{ publishname }}</span>
                </div>
            </div>
        </div>
        <div v-for="(item, key) in props.payload.datamodel" :key="key" class="detail-area">
            <p class="detail-title">模型[{{ key }}]</p>
            <div class="detail-content">
                <div class="detail-item all-line">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>字段定义</span>
                    </label>
                </div>
                <div v-for="mod in item.rule" :key="mod.name" class="detail-item no-label tab">
                    <label class="label">
                        <el-icon :size="16">
                            <svg-icon name="ri:checkbox-blank-circle-line" />
                        </el-icon>
                    </label>
                    <span class="content">{{ mod.text }}</span>
                </div>
            </div>
            <div v-for="(perm, key) in item.perm" :key="key" class="detail-content">
                <div class="detail-item all-line">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>{{ getPermFieldName(key) }}</span>
                    </label>
                </div>
                <div class="detail-item tab">
                    <label class="label">
                        <el-icon :size="16">
                            <svg-icon name="ri:checkbox-blank-circle-line" />
                        </el-icon>
                        <span>权限类型:</span>
                    </label>
                    <span class="content">{{ getPermFieldName(perm.type, 'type') }}</span>
                </div>
                <div class="detail-item tab">
                    <label class="label">
                        <el-icon :size="16">
                            <svg-icon name="ri:checkbox-blank-circle-line" />
                        </el-icon>
                        <span>权限关系:</span>
                    </label>
                    <span class="content">{{ getPermFieldName(perm.logic, 'logic') }}</span>
                </div>
                <div class="detail-item tab">
                    <label class="label">
                        <el-icon :size="16">
                            <svg-icon name="ri:checkbox-blank-circle-line" />
                        </el-icon>
                        <span>权限类型:</span>
                    </label>
                    <span class="content">{{ perm.value }}</span>
                </div>
            </div>
        </div>
        <div class="detail-area">
            <p class="detail-title">部署配置</p>
            <div class="detail-content">
                <div v-if="props.payload.config && props.payload.config.hasOwnProperty('db')" class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>数据库:</span>
                    </label>
                    <span class="content">{{ props.payload.config.db || '不使用配置' }}</span>
                </div>
                <div v-if="props.payload.config && props.payload.config.hasOwnProperty('cache')" class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>缓存:</span>
                    </label>
                    <span class="content">{{ props.payload.config.cache || '不使用配置' }}</span>
                </div>
                <div v-if="props.payload.config && props.payload.config.hasOwnProperty('mq')" class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>队列:</span>
                    </label>
                    <span class="content">{{ props.payload.config.mq || '不使用配置' }}</span>
                </div>
                <div v-if="props.payload.config && props.payload.config.hasOwnProperty('store')" class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>存储:</span>
                    </label>
                    <span class="content">{{ props.payload.config.store || '不使用配置' }}</span>
                </div>
                <div
                    v-if="props.payload.config && props.payload.config.hasOwnProperty('streamComputer')"
                    class="detail-item"
                >
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>流式计算:</span>
                    </label>
                    <span class="content">{{ props.payload.config.streamComputer || '不使用配置' }}</span>
                </div>
                <div
                    v-if="props.payload.config && props.payload.config.hasOwnProperty('blockComputer')"
                    class="detail-item"
                >
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>块式计算:</span>
                    </label>
                    <span class="content">{{ props.payload.config.blockComputer || '不使用配置' }}</span>
                </div>
                <div v-if="props.payload.config && props.payload.config.hasOwnProperty('other')" class="detail-item">
                    <label class="label">
                        <el-icon :size="18">
                            <svg-icon name="akar-icons:shipping-box-01" />
                        </el-icon>
                        <span>自定义:</span>
                    </label>
                    <span class="content">{{ props.payload.config.other || '不使用配置' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import appsApi from '@/services/apps'
import { getStateModel } from 'gsc-frontend-sdk/gfw/model/checkModel'
import { PublishOptions } from '@/services/services'

// 原始数据转换为文本
const appname = ref('')
const statename = ref('')
const publishname = ref('')
// 应用列表容器
const apps = ref(null)

const props = defineProps({
    // 部署完整信息
    payload: {
        type: Object
    }
})

const getPermFieldName = (key, type) => {
    // 获取权限类型
    if (!type) {
        switch (key) {
            case 'c':
                return '创建权限'
            case 'u':
                return '更新权限'
            case 'r':
                return '读取权限'
            case 'd':
                return '删除权限'
            case 'o':
                return '全部权限'
        }
    }

    // 获取权限类型
    if (type === 'type') {
        switch (key) {
            case 'user':
                return '用户'
            case 'group':
                return '角色'
        }
    }

    // 获取权限关系
    if (type === 'logic') {
        switch (key) {
            case '>':
                return '包含'
            case '=':
                return '属于'
        }
    }

    // 获取权限关系
    if (type === 'value') {
        switch (key) {
            case '>':
                return '包含'
            case '=':
                return '属于'
        }
    }
}

// 获取应用转换应用ID为应用名称
async function getAppList() {
    if (!apps.value) {
        const res = await appsApi.select()
        apps.value = res.getRecord()

    }
    for (let i = 0; i < apps.value.length; i++) {
        if (apps.value[i].id === props.payload.appid) {
            appname.value = apps.value[i].name
            break
        }
    }
}

// 获取部署状态文本
function getState() {
    const states = getStateModel()
    for (let i = 0; i < states.length; i++) {
        if (states[i].id === props.payload.state) {
            statename.value = states[i].name
            break
        }
    }
}

// 获取部署发布方式
function getPublish() {
    const states = PublishOptions
    for (let i = 0; i < states.length; i++) {
        if (states[i].id === props.payload.open) {
            publishname.value = states[i].name
            break
        }
    }
}

// 初始化函数,props可能变化,每次都要初始化
function initInfo() {
    getAppList()
    getState()
    getPublish()
}

onMounted(() => {
    initInfo()
})

watch(() => props.payload, () => {
    initInfo()
})
</script>

<style lang='scss' scoped>
.deploy-detail-box {
    padding: 15px;

    .detail-title {
        margin: 0;
        font-weight: bold;
    }

    .detail-area {
        margin-bottom: 30px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .detail-content {
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;

        .all-line {
            width: 100% !important;
        }

        .detail-item.no-label {
            margin-right: 20px;
            cursor: pointer;
            @include transition();

            &:hover {
                color: $text-primary;
            }

            .label {
                margin-right: 0;
            }

            i {
                margin-right: 0;
            }
        }

        .detail-item {
            display: flex;
            align-items: center;
            margin-right: 15px;
            margin-bottom: 15px;
            width: 165px;

            &.tab {
                margin-right: 0;
                margin-left: 20px;
            }

            .label {
                margin-right: 10px;
                display: flex;
                font-weight: bold;
                align-items: center;

                i {
                    color: #409eff;
                    margin-right: 5px;
                }
            }

            .content.primary {
                color: $text-primary;
            }

            .content.success {
                color: $text-success;
            }

            .content.danger {
                color: $text-danger;
            }

            .content.warning {
                color: $text-warning;
            }
        }
    }
}
</style>

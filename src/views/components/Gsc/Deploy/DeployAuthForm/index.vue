<template>
    <el-empty v-if="!props.deployName || !props.model" description="请先设置目标模型和部署名称" />
    <el-skeleton v-if="loading && props.deployName && props.model" animated>
        <template #template>
            <div class="skeleton">
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
            </div>
            <div class="skeleton">
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
            </div>
            <div class="skeleton">
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
            </div>
            <div class="skeleton">
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
            </div>
            <div class="skeleton">
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
            </div>
            <div class="skeleton">
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
            </div>
        </template>
    </el-skeleton>
    <transition name="el-fade-in-linear">
        <div v-if="!loading && props.deployName && props.model" class="api-auth-box">
            <el-card :style="{height: props.height + 50 + 'px'}" class="box-card empty-box">
                <template #header>
                    <div class="card-header">
                        <span>应用接口</span>
                    </div>
                </template>
                <draggable
                    v-show="apis.length > 0" :group="{ name: 'api', pull: 'clone', put: false }" :list="apis"
                    :sort="false" class="list-group" item-key="name"
                >
                    <template #item="{element}">
                        <div :class="{hit: element.searchHit}" class="api-item">
                            <p>
                                <el-icon :size="18" class="cube-icon" @click="removeApi(item.list, element)">
                                    <svg-icon name="eva:cube-fill" />
                                </el-icon>
                                <span>{{ element.name.split('@')[0] }}</span>@{{ element.name.split('@')[1] }}
                            </p>
                        </div>
                    </template>
                </draggable>
                <el-empty v-if="apis.length === 0" description="该模型暂无接口" />
            </el-card>
            <el-card class="box-card auth-box">
                <template #header>
                    <div class="card-header">
                        <span>接口权限</span>
                        <el-input
                            v-model="search2" :suffix-icon="Search" clearable
                            placeholder="输入接口名查找" size="small" style="width: 200px;float: right;"
                            @input="searchApi($event)"
                        />
                    </div>
                </template>
                <div
                    v-for="item in authApis" :key="item.name" :class="item.class"
                    :style="{height: props.height / 3}"
                    class="auth-box-item"
                >
                    <p class="title">{{ item.name }}</p>
                    <draggable
                        :list="item.list" :on-add="onAdd(item.list)" :on-start="onStart(item.list)"
                        :sort="false" :touch-start-threshold="5" class="list-group" group="api"
                        item-key="name"
                    >
                        <template #item="{element}">
                            <div :class="{hit: element.searchHit}" class="api-item">
                                <p>
                                    <el-icon :size="18" class="cube-icon" @click="removeApi(item.list, element)">
                                        <svg-icon name="eva:cube-fill" />
                                    </el-icon>
                                    <span>{{ element.name.split('@')[0] }}</span>@{{ element.name.split('@')[1] }}
                                    <el-icon :size="16" class="close-icon" @click="removeApi(item.list, element)">
                                        <Close />
                                    </el-icon>
                                </p>
                            </div>
                        </template>
                    </draggable>
                </div>
            </el-card>
        </div>
    </transition>
</template>

<script setup>
import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'
import { Close, Search } from '@element-plus/icons-vue'
import { reactive, ref, watch } from 'vue'
import { apiLevel } from 'gsc-frontend-sdk/gfw/service/service'
import { Application } from 'gsc-frontend-sdk/gfw/appliction/application'

const props = defineProps({
    height: {
        type: Number,
        default: 600
    },
    deployName: {
        type: String
    },
    appid: {
        type: [String, Number]
    },
    model: {
        type: String
    }
})

const loading = ref(true)
const apis = ref([])
// const search1 = ref('')
const search2 = ref('')
const authApis = reactive({
    PublicApi: {
        name: '公开权限',
        class: 'public-box',
        list: []
    },
    SessionApi: {
        name: '会话权限',
        class: 'session-box',
        list: []
    },
    OAuth2Api: {
        name: '授权权限',
        class: 'oauth-box',
        list: []
    },
    PrivateApi: {
        name: '私有权限',
        class: 'private-box',
        list: []
    },
    CloseApi: {
        name: '关闭权限',
        class: 'close-box',
        list: []
    }
})

// 添加元素到权限容器
const onAdd = list => {
    return () => {
        let count = {}
        for (let i = 0; i < list.length; i++) {
            const tmp = list[i]
            if (count[list[i].name]) {
                list.splice(i, 1)
                if (prevList) {
                    prevList.splice(prevListIndex, 0, tmp)
                }
                break
            }
            count[list[i].name] = 1
        }
        prevList = null
    }
}

// 当api元素移至其他权限并且已存在于其他权限,还原到原列表
let prevList = null
let prevListIndex = 0
const onStart = list => {
    return e => {
        prevList = list
        prevListIndex = e.oldIndex
    }
}

const removeApi = (list, item) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].name === item.name) {
            list.splice(i, 1)
            return
        }
    }
}

const getApiList = async() => {
    // const appinfo = ctx.getContext()
    const service = ServiceApi.New({
        name: props.deployName,
        model: props.model,
        header: QueryOptionBuilder.build().asc('id').build(),
        context: Application.build(props.appid)
    })
    const api = await service.loadApi()
    // const api = [];
    for (const tmp in api) {
        for (let i = 0; i < api[tmp].length; i++) {
            apis.value.push({
                name: `${tmp}@${api[tmp][i].param.length > 0 ? api[tmp][i].param.join(',') : 's'}`,
                level: api[tmp][i].level,
                searchHit: false
            })
            for (let j = 0; j < api[tmp][i].level.length; j++) {
                authApis[api[tmp][i].level[j]].list.push({
                    name: `${tmp}@${api[tmp][i].param.length > 0 ? api[tmp][i].param.join(',') : 's'}`,
                    level: api[tmp][i].level,
                    searchHit: false
                })
            }
        }
    }
    setTimeout(() => {
        loading.value = false
    }, 300)
}

// 接口查询
let searchHitList = []
const searchApi = e => {
    if (!e) {
        for (let i = 0; i < searchHitList.length; i++) {
            searchHitList[i].searchHit = false
        }
        searchHitList = []
        return
    }
    for (let i = 0; i < apis.value.length; i++) {
        const temp = apis.value[i]
        if (temp.name.indexOf(e) >= 0) {
            temp.searchHit = true
            searchHitList.push(temp)
        } else {
            temp.searchHit = false
        }
    }
    for (const authApisKey in authApis) {
        for (let i = 0; i < authApis[authApisKey].list.length; i++) {
            const item = authApis[authApisKey].list[i]
            if (item.name.indexOf(e) >= 0) {
                item.searchHit = true
                searchHitList.push(item)
            } else {
                item.searchHit = false
            }
        }
    }
}

// 构造权限结构
const getApiAuth = () => {
    let rs = {}
    for (const authApisKey in authApis) {
        for (let i = 0; i < authApis[authApisKey].list.length; i++) {
            const item = authApis[authApisKey].list[i]
            if (!rs[item.name]) {
                rs[item.name] = apiLevel[authApisKey].toString()
            } else {
                rs[item.name] += ',' + apiLevel[authApisKey]
            }
        }
    }
    return rs
}

if (props.deployName && props.model) {
    getApiList()
}

watch(() => props.deployName, () => {
    if (props.deployName && props.model) {
        getApiList()
    }
})

watch(() => props.model, () => {
    if (props.deployName && props.model) {
        getApiList()
    }
})

defineExpose({
    getApiAuth
})
</script>

<style lang='scss' scoped>
.skeleton {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    :deep(.el-skeleton__item) {
        margin: 0 10px;
    }
}

.api-auth-box {
    display: flex;
    margin: 0 -10px;

    .list-group {
        height: 100%;
        overflow: auto;
        padding: 10px 10px 20px 10px;

        .api-item {
            cursor: move;
            padding: 0 10px;
            height: 26px;
            line-height: 26px;
            margin: 5px;
            color: $text-primary;
            display: inline-block;
            @include border-background-primary();

            &.hit {
                @include border-background-primary();
                color: $text-danger;
            }

            p {
                display: flex;
                align-items: center;
                margin: 0;
            }

            span {
                font-weight: bold;
            }

            .cube-icon {
                margin-right: 5px;
            }

            .close-icon {
                cursor: pointer;
                margin-left: 5px;
                border-radius: 50%;
                padding: 2px;
                @include transition();

                &:hover {
                    background: $text-primary;
                    color: #fff;
                }
            }
        }
    }

    .card-header {
        display: flex;
        align-items: center;

        span {
            flex-grow: 1;
        }
    }

    :deep(.el-card__header) {
        padding: 10px 15px;
        font-weight: bold;
        height: 47px;
        line-height: 27px;
    }

    :deep(.el-card__body) {
        padding: 0;
        overflow: auto;
        flex-grow: 1;
    }

    .empty-box {
        height: 650px;
        border: 1px #ddd solid;
        width: 280px;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
    }

    .auth-box {
        flex-grow: 1;
        margin: 0 10px;
        width: 50%;

        :deep(.el-card__body) {
            padding: 0;
            display: flex;
            flex-wrap: wrap;
        }

        .title {
            position: absolute;
            bottom: 5px;
            right: 10px;
            margin: 0;
            color: #909399;
        }

        .auth-box-item:first-child {
            width: 100%;
        }

        .auth-box-item {
            width: 50%;
            height: 200px;
            border-color: #ebeef5;
            border-style: solid;
            border-width: 0;
            position: relative;
        }

        .public-box {
            border-bottom-width: 1px;

            .title {
                color: #79bbff;
            }
        }

        .session-box {
            border-bottom-width: 1px;
            border-right-width: 1px;

            .title {
                color: #95d475;
            }
        }

        .oauth-box {
            border-bottom-width: 1px;

            .title {
                color: #eebe77;
            }
        }

        .private-box {
            border-right-width: 1px;

            .title {
                color: #b1b3b8;
            }
        }

        .close-box {
            .title {
                color: #f89898;
            }
        }
    }
}
</style>

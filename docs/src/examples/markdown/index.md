# Examples

<!-- 访问 /examples/markdown 时自动跳到“第一级第一个 md”，左侧用 sidebar 展示分级列表 -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  router.go('/examples/markdown/a__HTML/a.基础篇/01.SVG')
})
</script>



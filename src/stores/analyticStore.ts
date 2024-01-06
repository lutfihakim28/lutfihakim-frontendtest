import { AnalyticDto } from '@/dtos/AnalyticDto';
import { AnalyticQueryDto } from '@/dtos/AnalyticQueryDto';
import { CustomRequest } from '@/services/CustomRequest';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAppStore } from './appStore';
import { useRouter } from 'vue-router';

type GroupedAnalyticType = {
  scope: string;
  total: number;
  details: GroupedAnalyticDetailType[];
}

type GroupedAnalyticDetailType = {
  date: string;
  count: number;
}

export const useAnalyticStore = defineStore('analytic', () => {
  const appStore = useAppStore()
  const analytics = ref<AnalyticDto[]>([])
  const request = new CustomRequest()
  const router = useRouter();

  const groupedAnalytics = computed<GroupedAnalyticType[]>(() => {
    const grouped: GroupedAnalyticType[] = [];
    analytics.value.forEach((analytic) => {
      const existingIndex = grouped.findIndex((data) => data.scope === analytic.scope)
      const detail = {
        count: analytic.count,
        date: analytic.date,
      }

      if (existingIndex === -1) {
        grouped.push({
          scope: analytic.scope,
          total: analytic.count,
          details: [
            detail
          ]
        })
      } else {
        grouped[existingIndex].details.push(detail)
        grouped[existingIndex].total += detail.count
      }
    })

    return grouped
  })

  async function getAnalytics(date: string) {
    try {
      const query = new AnalyticQueryDto()
      query.listingDate = date;
      const response = await request.GET('/analytic/click', instanceToPlain(query))
      if (response instanceof Array) {
        analytics.value.push(...response.map(data => plainToInstance(AnalyticDto, {
          ...data,
          date,
        })))
      } else if (typeof response === 'object') {
        analytics.value.push(plainToInstance(AnalyticDto, {
          ...response,
          date,
        }))
      }
      return Promise.resolve()
    } catch (error) {
      if (typeof error === 'string') {
        appStore.showSnackbar(error, 'error')
        return
      }
      // if (typeof error)
      if (typeof error === 'object') {
        appStore.showSnackbar((error as CustomErrorType).message, 'error')
        return
      }
      appStore.showSnackbar('Terjadi kesalahan', 'error')
      console.error(error)
    }
  }

  return {
    analytics,
    getAnalytics,
    groupedAnalytics,
  }
})

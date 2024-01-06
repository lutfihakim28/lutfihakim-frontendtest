<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { computed } from 'vue';
import { ref, watch, onMounted } from 'vue';
import { getDates, getMonth, getDate } from '@utils/date'
import { useAnalyticStore } from '@/stores/analyticStore';

type TableHeaderType = {
  group: string;
  dates: string[];
}

const analyticStore = useAnalyticStore()

const date = ref<Date[]>();
const loading = ref(false);

const allDates = computed(() => {
  if (date.value) return getDates(date.value)
  return []
})

const groupedAnalytics = computed(() => analyticStore.groupedAnalytics)

const tableHeaders = computed(() => {
  const headers: TableHeaderType[] = [];
  allDates.value.forEach((date) => {
    const headerMonth = getMonth(date)
    const headerDate = getDate(date)
    const existingIndex = headers.findIndex((header) => header.group === headerMonth)

    if (existingIndex === -1) {
      headers.push({
        group: headerMonth,
        dates: [headerDate]
      })
    } else {
      headers[existingIndex].dates.push(headerDate)
    }
  })
  return headers
})

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date();
  date.value = [startDate, endDate];
})

async function getAnalytics() {
  try {
    analyticStore.analytics = [];
    await Promise.all(allDates.value.map((date) => {
      return analyticStore.getAnalytics(date)
    }))
  } catch (error) {
    console.error(error)
  }
}

function getCount(scope: string, date: string) {
  const dataByScope = groupedAnalytics.value.find((analytic) => analytic.scope === scope)
  if (!dataByScope) return 0
  const dataByDate = dataByScope.details.find((detail) => detail.date === date)
  if (!dataByDate) return 0
  return dataByDate.count
}

watch(date, () => {
  if (!date.value) return
  getAnalytics()
}, {
  immediate: true
})
</script>

<template>
  <v-container style="margin-top: -64px; padding-top: 96px;">
    <v-row>
      <v-card width="100%" variant="tonal" style="overflow: visible;">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <VueDatePicker
                v-model="date"
                dark
                range
                format="yyyy/MM/dd"
                auto-apply
                :disabled="loading"
                :enable-time-picker="false"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div style="width: 100%; overflow: auto;">
                <table>
                  <thead>
                    <tr>
                      <th rowspan="2">Item</th>
                      <th rowspan="2">Total</th>
                      <th v-for="header in tableHeaders" :key="header.group" :colspan="header.dates.length">{{ header.group }}</th>
                    </tr>
                    <tr>
                      <th v-for="date in allDates" :key="date">{{ getDate(date) }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td align="center" :colspan="allDates.length + 2">
                        <span style="font-style: italic; font-size: 12px; border: none;">Memuat...</span>
                      </td>
                    </tr>
                    <tr v-else v-for="data in groupedAnalytics" :key="data.scope">
                      <td>{{ data.scope }}</td>
                      <td align="center">{{ data.total }}</td>
                      <td v-for="date in allDates" :key="date" align="center">{{ getCount(data.scope, date) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>


<style scoped lang="scss">
table {
  width: 100%;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  border-collapse: collapse;
  padding-bottom: 8px;

  * {
    border: 1px solid #a1a1a1;
  }

  thead {
    font-weight: 500;

    th {
      padding: 4px 18px;
      width: 100%;
    }
  }

  tbody {
    font-weight: 400;
    opacity: 0.8;

    td {
      padding: 4px 18px;
      width: 100%;
    }
  }
}
</style>

<template>
	<div
		class="absolute flex flex-col bg-white p-6 shadow-md border border-gray-200 rounded-xl max-w-xs z-10"
	>
		<div class="mb-2 text-center">
			{{ !isNew && !isEdit ? 'Showcase' : isNew ? 'Create' : 'Edit' }}
		</div>
		<button
			type="button"
			class="absolute top-3 right-3 w-8 h-8 rounded-full flex justify-center items-center hover:bg-gray-50 transition-colors"
			@click="cancelHandler"
		>
			X
		</button>
		<div>
			<div class="flex flex-col gap-2">
				<div class="flex flex-col gap-2">
					<strong class="text-sm">Date:</strong>
					<VueDatePicker
						:format="datepickerFormat"
						v-model="date"
						:disabled="!isNew && !isEdit"
					/>
				</div>
				<div class="flex gap-2">
					<div class="flex flex-col gap-2">
						<strong class="text-sm">Start time:</strong>
						<VueDatePicker
							v-model="timeStart"
							time-picker
							:disabled="!isNew && !isEdit"
						/>
					</div>
					<div class="flex flex-col gap-2">
						<strong class="text-sm">End time:</strong>
						<VueDatePicker
							v-model="timeEnd"
							time-picker
							:disabled="!isNew && !isEdit"
						/>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!(!isNew && !isEdit)" class="flex justify-between gap-2 mt-4">
			<Button
				primary
				@click="saveHandler"
				:label="isNew ? 'Create' : 'Save'"
				class="w-1/2"
			/>
			<Button primary @click="cancelHandler" label="Cancel" class="w-1/2" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Button from '../Button/Button.vue'
import { IEventData, TEvent } from '../Calendar/helper/types'
// import format from "date-fns/format";
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default defineComponent({
	name: 'CalendarTooltip',
})
</script>
<script lang="ts" setup>
import format from 'date-fns/format'
interface Props {
	selectedDate: Date
	eventData?: IEventData | null
	isCreateNew?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	selectedDate: () => new Date(),
})
const emit = defineEmits<{
	(e: 'save', data: TEvent): void
	(e: 'close'): void
}>()
const datepickerFormat = (date: Date) => {
	const day = date.getDate()
	const dateFormatted = day < 10 ? '0' + day : day
	const month = date.getMonth() + 1
	const monthFormatted = month < 10 ? '0' + month : month
	const year = date.getFullYear()

	return `${year}/${monthFormatted}/${dateFormatted}`
}

const isNew = ref(true)
const isEdit = ref(false)

const saveHandler = () => {
	const startDate = new Date(
		new Date(date.value).setHours(
			timeStart.value.hours,
			timeStart.value.minutes,
			0
		)
	)
	const endDate = new Date(
		new Date(date.value).setHours(timeEnd.value.hours, timeEnd.value.minutes, 0)
	)
	emit('save', {
		start: format(startDate, 'yyyy-MM-dd HH:mm'),
		end: format(endDate, 'yyyy-MM-dd HH:mm'),
		title: 'My new event',
		class: 'new-data',
	})
}
const cancelHandler = () => {
	emit('close')
}

// variables
const date = ref(new Date())
const timeStart = ref({ hours: 0, minutes: 0, seconds: 0 })
const timeEnd = ref({ hours: 0, minutes: 0, seconds: 0 })

// setters
const setNewData = () => {
	isEdit.value = false
	isNew.value = true
	console.log('set new data')
	date.value = props.selectedDate
	timeStart.value = { hours: 0, minutes: 0, seconds: 0 }
	timeEnd.value = { hours: 0, minutes: 0, seconds: 0 }
}
const setData = (data: IEventData) => {
	if (data.class !== 'new-data') {
		isNew.value = false
		isEdit.value = false
	} else {
		isNew.value = false
		isEdit.value = true
	}
	console.log('set data')
	date.value = data.start
	timeStart.value = {
		hours: new Date(data.start).getHours(),
		minutes: new Date(data.start).getMinutes(),
		seconds: 0,
	}
	timeEnd.value = {
		hours: new Date(data.end).getHours(),
		minutes: new Date(data.end).getMinutes(),
		seconds: 0,
	}
}

// watch
watch(
	() => [props.selectedDate, props.eventData],
	([selectedDateVal, eventDataVal]) => {
		if (eventDataVal) {
			setData(eventDataVal as IEventData)
		} else if (selectedDateVal) {
			setNewData()
		}
	}
)
</script>

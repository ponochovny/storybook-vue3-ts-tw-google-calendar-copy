<template>
	<div
		class="
			absolute
			flex flex-col
			bg-white
			p-6
			shadow-md
			border border-gray-200
			rounded-xl
			max-w-xs
			z-10
		"
	>
		<div>CalendarTooltip</div>
		<div>
			<div>{{ selectedDate?.toString() }}</div>
		</div>
		<div>
			<Button primary @click="saveHandler" label="Save" />
			<Button primary @click="cancelHandler" label="Cancel" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../Button/Button.vue'
import { TEvent } from '../Calendar/helper/types'

export default defineComponent({
	name: 'CalendarTooltip',
})
</script>
<script lang="ts" setup>
interface Props {
	selectedDate: Date
	isCreateNew: boolean
}
const props = defineProps<Props>()
const emit =
	defineEmits<{
		(e: 'save', data: TEvent): void
		(e: 'close'): void
	}>()
const saveHandler = () => {
	const formatDate = (date: Date): string => {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		return `${year}-${month < 10 ? '0' + month : month}-${
			day < 10 ? '0' + day : day
		} ${date.getHours()}:${date.getMinutes()}`
	}
	const startDate = new Date(new Date(props.selectedDate).setHours(12, 30, 0))
	const endDate = new Date(new Date(props.selectedDate).setHours(13, 25, 0))
	const startDateFormatted = formatDate(startDate)
	const endDateFormatted = formatDate(endDate)
	emit('save', {
		start: startDateFormatted,
		end: endDateFormatted,
		title: 'Test',
		class: 'new-data',
	})
}
const cancelHandler = () => {
	emit('close')
}
</script>

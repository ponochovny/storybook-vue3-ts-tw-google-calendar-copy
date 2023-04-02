import UiCalendar from './Calendar.vue'

export default {
	title: 'Calendar',
	component: UiCalendar,
}

const Template = (args) => ({
	components: { UiCalendar },
	setup() {
		return { args }
	},
	template: '<ui-calendar v-bind="args" />',
})

export const General = Template.bind({})
General.args = {
	disableViews: ['years', 'year', 'day'],
	events: [],
}
export const Fullfilled = Template.bind({})
Fullfilled.args = {
	disableViews: ['years', 'year', 'day'],
	events: [
		{
			start: '2023-04-04 12:30',
			end: '2023-04-04 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-04 14:30',
			end: '2023-04-04 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-04 16:00',
			end: '2023-04-04 17:10',
			title: 'Some title',
		},
		{
			start: '2023-04-04 17:20',
			end: '2023-04-04 18:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-05 12:30',
			end: '2023-04-05 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-05 14:30',
			end: '2023-04-05 15:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-06 12:30',
			end: '2023-04-06 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-06 14:30',
			end: '2023-04-06 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-06 16:00',
			end: '2023-04-06 17:10',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-07 12:30',
			end: '2023-04-07 13:45',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-08',
			end: '2023-04-11',
			title: 'Some title',
			allDay: true,
		},
	],
}
export const WithActiveEvents = Template.bind({})
WithActiveEvents.args = {
	disableViews: ['years', 'year', 'day'],
	events: [
		{
			start: '2023-04-04 12:30',
			end: '2023-04-04 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-04 14:30',
			end: '2023-04-04 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-04 16:00',
			end: '2023-04-04 17:10',
			title: 'Some title',
		},
		{
			start: '2023-04-04 17:20',
			end: '2023-04-04 18:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-05 12:30',
			end: '2023-04-05 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		{
			start: '2023-04-05 14:30',
			end: '2023-04-05 15:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-06 12:30',
			end: '2023-04-06 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-06 14:30',
			end: '2023-04-06 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-06 16:00',
			end: '2023-04-06 17:10',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-07 12:30',
			end: '2023-04-07 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		//
		{
			start: '2023-04-08',
			end: '2023-04-11',
			title: 'Some title',
			allDay: true,
			class: 'new-data',
		},
	],
}
export const WithDisableCreation = Template.bind({})
WithDisableCreation.args = {
	disableViews: ['years', 'year', 'day'],
	disableCreation: true,
	events: [
		{
			start: '2023-04-04 12:30',
			end: '2023-04-04 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-04 14:30',
			end: '2023-04-04 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-04 16:00',
			end: '2023-04-04 17:10',
			title: 'Some title',
		},
		{
			start: '2023-04-04 17:20',
			end: '2023-04-04 18:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-05 12:30',
			end: '2023-04-05 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		{
			start: '2023-04-05 14:30',
			end: '2023-04-05 15:00',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-06 12:30',
			end: '2023-04-06 13:45',
			title: 'Some title',
		},
		{
			start: '2023-04-06 14:30',
			end: '2023-04-06 15:00',
			title: 'Some title',
		},
		{
			start: '2023-04-06 16:00',
			end: '2023-04-06 17:10',
			title: 'Some title',
		},
		//
		{
			start: '2023-04-07 12:30',
			end: '2023-04-07 13:45',
			title: 'Some title',
			class: 'new-data',
		},
		//
		{
			start: '2023-04-08',
			end: '2023-04-11',
			title: 'Some title',
			allDay: true,
			class: 'new-data',
		},
	],
}

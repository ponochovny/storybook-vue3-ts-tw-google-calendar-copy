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
	title: 'Hello!',
	disableViews: ['years', 'year', 'day'],
}

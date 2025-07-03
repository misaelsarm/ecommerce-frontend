
import { AttributeInterface } from "@/interfaces"
//import styles from '@/styles/ProductDetails.module.scss'
import { Tooltip } from "react-tooltip"
//import ReactSelect from 'react-select'
import TextArea from "./common/TextArea/TextArea"
import Input from "./common/Input/Input"
import Select from "./common/Select/Select"

interface Props {
	attribute: AttributeInterface,
	register: any
	errors: any
	control: any
	index: number
	name?: string
	productIndex: number


	line1?: any,
	setLine1?: any,
	line2?: any,
	setLine2?: any,
	font1?: any,
	setFont1?: any,
	font2?: any,
	setFont2?: any,
}

export const RenderAttribute = ({ attribute, register, errors, control, index, name, line1,
	setLine1,
	line2,
	setLine2,
	font1,
	setFont1,
	font2,
	setFont2,
	productIndex
}: Props) => {

	console.log({ productIndex })

	const formatOptionLabel1 = ({ label, name }: any) => (
		<span className={name}> {label}</span>
	);

	const formatOptionLabel2 = ({ label, name }: any) => (
		<span className={name} >{label}</span>
	);

	// Custom validation function to limit the number of selected checkboxes
	const validateCheckboxLimit = (selectedCheckboxes: any, limit: number) => {
		console.log({ selectedCheckboxes }, { limit })
		return selectedCheckboxes.length <= limit || `Máximo ${limit} opciones permitidas`;
	};

	switch (attribute.type) {
		case 'dropdown':
			return (
				<Select
					control={control}
					name={name || `attributes.${index}.value`}
					label={attribute.longName}
					required
					errors={errors}
					options={
						attribute.values.map(value => (
							{
								label: value.label,
								value: JSON.stringify(value)
							}
						))
					}
				/>
			)

		case 'color':
			return (
				<div className="colors-input">
					<span>{attribute.longName}</span>
					<div className="colors">
						{
							attribute.values.map((value) => (
								attribute.max && attribute.max > 1 ?
									<div
										data-tooltip-id={attribute._id}
										data-tooltip-content={value.label}
										key={value.value} className="color">
										<input
											{...register(name || `attributes.${index}.value`, {
												validate: (selectedCheckboxes: any) => validateCheckboxLimit(selectedCheckboxes, attribute.max), // Change the limit as needed
												required: {
													value: true,
													message: 'Requerido'
												},
											})}
											type="checkbox"
											value={JSON.stringify(value)}
											id={`product-${productIndex}-attr-${attribute._id}-value-${value.value}`}
										/>
										<label
											style={{
												backgroundColor: value.value
											}}
											htmlFor={`product-${productIndex}-attr-${attribute._id}-value-${value.value}`}
										>
										</label>
									</div>
									: <>
										<div
											data-tooltip-id={attribute._id}
											data-tooltip-content={value.label}
											key={value.value} className="color">
											<input
												{...register(name || `attributes.${index}.value`, {
													required: {
														value: true,
														message: 'Requerido'
													},
												})}
												type="radio"
												value={JSON.stringify(value)}
												id={`product-${productIndex}-attr-${attribute._id}-value-${value.value}`}

											/>

											<label
												style={{
													backgroundColor: value.value
												}}
												htmlFor={`product-${productIndex}-attr-${attribute._id}-value-${value.value}`}												>
											</label>
										</div>
									</>
							))
						}
					</div>
					{
						//@ts-ignore
						errors && errors[name] &&
						//@ts-ignore
						<span className='error'>{errors[name].message}</span>
					}
					{
						typeof errors === 'string' &&
						<span className='error'>{errors}</span>
					}
					<Tooltip id={attribute._id} />
				</div>
			)

		case 'long-text':
			return (
				<TextArea
					register={register}
					errors={errors}
					required
					name={name || `attributes.${index}.value`}
					label={attribute.longName}
					max={attribute.max}
				/>
			)
		case 'short-text':
			return (
				<>
					<Input
						required
						register={register}
						name={name || `attributes.${index}.value`}
						errors={errors}
						label={attribute.longName}
						max={attribute.max}
					/>
				</>
			)
		case 'font':
			return (
				<div className="font-attribute">
					{/* <label htmlFor="">{attribute.longName}</label>
					<div className={styles.col}>
						<div className={styles.row}>
							<input onChange={(e) => {
								setLine1(e.target.value)
							}}
								placeholder='Tu texto aquí'
								className='input'
								type="text"
								value={line1}
							/>
							<div style={{
								width: 300
							}}>
								<ReactSelect
									options={classNames}
									formatOptionLabel={formatOptionLabel1}
									defaultValue={font1}
									onChange={(e: any) => {
										setFont1(e)
									}}
								/>
							</div>
						</div>
						<div className={styles.row}>
							<input
								onChange={(e) => {
									setLine2(e.target.value)
								}}
								placeholder='Tu texto aquí'
								className='input'
								type="text"
								value={line2}
							/>
							<div style={{
								width: 300
							}}>
								<ReactSelect
									options={classNames}
									formatOptionLabel={formatOptionLabel2}
									defaultValue={font2}
									onChange={(e: any) => {
										setFont2(e)
									}}
								/>
							</div>
						</div>
						<span>Vista previa de tipografías</span>
						<span style={{
							fontSize: 30
						}} className={font1?.name}>{line1}</span>
						<span style={{
							fontSize: 30
						}} className={font2?.name}>{line2}</span>
					</div> */}
				</div>
			)
		default:
			break;
	}

}
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import './index.css'

const constraintsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    cowinData: [],
    status: constraintsStatus.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({status: constraintsStatus.loading})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)

    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      const last7DaysVaccinationData = updatedData.last7DaysVaccination.map(
        each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        }),
      )
      updatedData.last7DaysVaccination = last7DaysVaccinationData
      this.setState({cowinData: updatedData, status: constraintsStatus.success})
      console.log(updatedData)
    } else {
      this.setState({status: constraintsStatus.failure})
    }
  }

  DataFormatter = number => {
    if (number > 1000) {
      return `${(number / 1000).toString()}k`
    }
    return number.toString()
  }

  onSuccessDisplay = () => {
    const {cowinData} = this.state
    return (
      <div>
        <h1 className="heading">CoWin Vaccination in India</h1>
        <div className="vaccination-coverage">
          <h1 className="sub-heading">Vaccination Coverage</h1>

          <BarChart
            data={cowinData.last7DaysVaccination}
            margin={{
              top: 5,
            }}
            width={1000}
            height={500}
          >
            <XAxis
              dataKey="vaccineDate"
              tick={{
                stroke: 'gray',
                strokeWidth: 1,
              }}
            />
            <YAxis
              tickFormatter={this.DataFormatter}
              tick={{
                stroke: 'gray',
                strokeWidth: 0,
              }}
            />
            <Legend
              wrapperStyle={{
                padding: 30,
              }}
            />
            <Bar dataKey="dose1" name="dose1" fill="#5a8dee" barSize="20%" />
            <Bar dataKey="dose2" name="dose2" fill=" #f54394" barSize="20%" />
          </BarChart>
        </div>
        <div className="vaccination-gender">
          <h1 className="sub-heading">Vaccination by gender</h1>

          <PieChart width={1000} height={300}>
            <Pie
              cx="70%"
              cy="40%"
              data={cowinData.vaccinationByGender}
              startAngle={0}
              endAngle={180}
              innerRadius="40%"
              outerRadius="70%"
              dataKey="count"
            >
              <Cell name="male" fill="#f54394" />
              <Cell name="female" fill="#5a8dee" />
              <Cell name="others" fill="#2cc6c6" />
            </Pie>
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="middle"
              align="center"
            />
          </PieChart>
        </div>
        <div className="vaccination-age">
          <h1 className="sub-heading">Vaccination by age</h1>

          <PieChart width={1000} height={300}>
            <Pie
              cx="70%"
              cy="40%"
              data={cowinData.vaccinationByAge}
              startAngle={0}
              endAngle={360}
              // innerRadius="%"
              outerRadius="70%"
              dataKey="count"
            >
              <Cell name="18-44" fill="#2d87bb" />
              <Cell name="44-60" fill="#a3df9f" />
              <Cell name="Above 60" fill="#64c2a6" />
            </Pie>
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </div>
      </div>
    )
  }

  onfailureDisplay = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  onLoaderDisplay = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  onrenderDisplay = () => {
    const {status} = this.state

    switch (status) {
      case 'SUCCESS':
        return this.onSuccessDisplay()
      case 'FAILURE':
        return this.onfailureDisplay()
      case 'LOADING':
        return this.onLoaderDisplay()
      default:
        return null
    }
  }

  render() {
    const {cowinData, isFailure, isLoading} = this.state

    return (
      <div className="bg-color">
        <div className="logo-items">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="logo-name">co-WIN</p>
        </div>
        {this.onrenderDisplay()}
      </div>
    )
  }
}
export default CowinDashboard

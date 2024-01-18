import { useEffect, useState } from 'react'
import { intervalToDuration} from 'date-fns'
import { useSpring, animated } from 'react-spring'
import './App.css'

function App() {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [can_play_animation, setCan_play_animation] = useState(false)

  const [display, setDisplay] = useState({
    years: '- -',
    months: '- -',
    days: '- -'
  })

  const [isError, setIsError] = useState({
    years: false,
    months: false,
    days: false
  })

  const month_day_count = [
    31,
    29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31 
  ]

  function date_is_valid() {
    let errors = {
      years: false,
      months: false,
      days: false
    }
    let current = new Date();
    let proxy = new Date(year, month - 1, day)
    if (proxy > current) {
      errors.years = true;
      console.log(proxy, 'in future')
    }
    if (month > 12 || month < 1 || month === '' ) {
      errors.months = true
      console.log('month error')
    }
    if (day > 31 || day < 1 || month_day_count[month - 1] && day > month_day_count[month - 1] || day === '') {
      errors.days = true;
      console.log('day error')
    }
    //leap year
    if (year % 4 != 0 && month == 2 && day > 28) {
      console.log('leap year error')
      errors.days = true;
    }

    if (year === '' || year > new Date().getFullYear()) {
      errors.years = true;
    }

    
    for (const key in errors) {
      if (errors[key] == true) {
        setIsError(errors)
        return false;
      }
    }
    setIsError(errors)
    return true;
  }

  function displayBirthday() {
    let birthday = new Date(year, month - 1, day)
    let current = new Date()
    const diff = intervalToDuration({start: birthday, end: current})
    console.log(diff)
    setCan_play_animation(true)
    setDisplay({
      years: diff.years || '- -',
      months: diff.months || '- -',
      days: diff.days || '- -'
    })
    
    if (!diff.years && !diff.months && !diff.days) {
      console.log('triggered')
      setDisplay({
      years: diff.years || '- -',
      months: diff.months || '- -',
      days: diff.days || 0
      })
    }
    
  }

  function clickHandler() {
    if (date_is_valid() === true) {
      displayBirthday()
    }
    else {
      setDisplay({
        years: '- -',
        months: '- -',
        days: '- -'
      })
    }
  }
  
  const error_color = "hsl(0, 100%, 67%)"
  const label_color = "hsl(0, 1%, 44%)"
  const input_color = "hsl(0, 0%, 86%)"

  function Number({ n }) {
    if (!can_play_animation) {
      return <span>{n}</span>
    }
    const { number } = useSpring({
      from: { number: 0},
      number: n,
      delay: 100,
      config: { mass: 1, tension: 23, friction: 10},
      onRest: () => {
        console.log('animation finished')
        setCan_play_animation(false);
      }
    });
    return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>
  }

  return (
    <div className='wrapper-wrapper'>
      <div className='birthday-wrapper'>
        <div className='form-wrapper'>
          <div className='grid-3-mobile-wrapper'>
            <form className='grid-3'>
            <label htmlFor='day' style={{color: isError.days ? error_color : label_color}}>DAY</label>
              <label htmlFor='month' style={{color: isError.months ? error_color : label_color}}>MONTH</label>
              <label htmlFor='year' style={{color: isError.years ? error_color : label_color}}>YEAR</label>
              
              <input type='number' id='day' name='day' placeholder='DD' value={day} style={{borderColor: isError.days ? error_color : input_color}} onChange={(e) => setDay(e.target.value != '' ? parseInt(e.target.value) : e.target.value)} />
              <input type='number' id='month' name='month' placeholder='MM' value={month} style={{borderColor: isError.months ? error_color : input_color}} onChange={(e) => setMonth(e.target.value != '' ? parseInt(e.target.value) : e.target.value)} />
              <input type='number' id='year' name='year' placeholder='YYYY' value={year} style={{borderColor: isError.years ? error_color : input_color}} onChange={(e) => setYear(e.target.value != '' ? parseInt(e.target.value) : e.target.value)} />

              <p className='error-message'>{isError.days ? "Must be a valid day" : " "}</p>
              <p className='error-message'>{isError.months ? "Must be a valid month" : " "}</p>
              <p className='error-message'>{isError.years ? "Must be in the past" : " "}</p>
            </form>
          </div>
          </div>
          
          <div className='w-100'>
          <div className='division-button-wrapper'>
            <div className='gap-div'></div>
            <div className='division-line'></div>
            </div>
            <a className='activate-birthday' onClick={clickHandler}>
              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="44" viewBox="0 0 46 44">
                <g fill="none" stroke="white" strokeWidth="2">
                  <path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44"/>
                </g>
              </svg>
            </a>
            </div>
          
        
          
      
        
        <div className='content-wrapper'>
          <div className='content'>
            <h2 id='margin-top-0'><span className='value-display'>{display.years == '- -' ? display.years : <Number n={display.years} />}</span>{display.years == 1 ? 'year' : 'years'}</h2>
            <h2><span className='value-display'>{display.months == '- -' ? display.months : <Number n={display.months} />}</span>{display.months == 1 ? 'month' : 'months'}</h2>
            <h2><span className='value-display'>{display.days == '- -' ? display.days : <Number n={display.days} />}</span>{display.days == 1 ? 'day' : 'days'}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

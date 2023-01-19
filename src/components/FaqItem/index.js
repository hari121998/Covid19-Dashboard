import './index.css'

const FaqItem = props => {
  const {faqItem} = props
  const {question, answer} = faqItem

  return (
    <li className="faq-item-container">
      <h4>{question}</h4>
      <p>{answer}</p>
    </li>
  )
}

export default FaqItem

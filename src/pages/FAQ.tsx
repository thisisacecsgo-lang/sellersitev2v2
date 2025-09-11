import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I add a new product to my profile?",
    answer: (
      <>
        You can add a new product by clicking the "Add New Product" button in the sidebar. This will take you to a form where you can fill in all the details about your product, such as its name, category, price, and quantity. You can find this button at the bottom of the main menu on the left.
        <br /><br />
        <Link to="/product/new" className="text-primary hover:underline">Click here to add a product now.</Link>
      </>
    ),
  },
  {
    question: "How can I quickly update the quantity of my products?",
    answer: (
      <>
        The "Update Qty" page is designed for rapid stock updates. You can "scan" a product (which simulates finding it quickly) and then use quick-action buttons (+1, -1, +5) or enter a new value directly to adjust the available quantity. This is perfect for when you've just harvested or sold items offline.
        <br /><br />
        <Link to="/update-quantity" className="text-primary hover:underline">Go to the Update Quantity page.</Link>
      </>
    ),
  },
  {
    question: "How do I manage my orders?",
    answer: (
      <>
        The "Orders" page shows all your incoming orders, sorted by date. You can view today's orders, see upcoming orders for tomorrow, and check past dates using the calendar. This page helps you track what needs to be prepared for pickup and when.
        <br /><br />
        <Link to="/orders" className="text-primary hover:underline">View your orders here.</Link>
      </>
    ),
  },
  {
    question: "How can I see my earnings and payment history?",
    answer: (
      <>
        Your financial information is available on the "Revenue" page. It provides an overview of your total revenue, upcoming payouts, and a detailed history of past payments from the platform.
        <br /><br />
        <Link to="/revenue" className="text-primary hover:underline">Check your revenue report.</Link>
      </>
    ),
  },
  {
    question: "Can I respond to customer reviews?",
    answer:
      "Yes! On the \"My Reviews\" page, you can interact with customer feedback. You have the option to post a public reply that appears directly under a review, or send a private message to the buyer to address their comments directly. Engaging with reviews is a great way to build trust with your customers.",
  },
  {
    question: "How do I edit my profile information?",
    answer: (
      <>
        You can edit your farm's name, description, and other details by going to your profile page and clicking the "Edit Profile" button. Keeping your profile updated helps customers learn more about you and your practices.
        <br /><br />
        <Link to="/seller/seller-5" className="text-primary hover:underline">Go to your profile.</Link>
      </>
    ),
  },
];

const FAQ = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-center mb-8">
          Find answers to common questions about managing your seller profile and products.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
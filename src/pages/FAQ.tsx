import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import BackButton from "@/components/BackButton";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  Camera,
  Edit,
  ClipboardCheck,
  Banknote,
  MessageSquareHeart,
  ShieldAlert,
  UserCircle,
  Phone, // Import Phone icon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

const faqs = [
  {
    question: "How do I add a new product?",
    answer: (
      <div className="space-y-4">
        <p>
          Adding a product is simple! Navigate to the sidebar and click the{" "}
          <Link to="/product/new" className="text-primary font-semibold hover:underline">
            Add New Product
          </Link>{" "}
          button. This will open a form where you can detail everything about your item.
        </p>
        <div className="p-4 bg-secondary/50 rounded-lg border">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Pro Tips for a Great Listing:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Good Photos are Key:</strong> Use clear, bright photos. You can upload multiple images to show different angles. A good photo is your best sales tool!
            </li>
            <li>
              <strong className="text-foreground">Write a Clear Description:</strong> Tell customers what makes your product special. Is it organic? A family recipe? Mention the taste, texture, and best uses.
            </li>
            <li>
              <strong className="text-foreground">Be Specific with Quantity:</strong> Instead of "a box," use specific units like "500g," "1 liter," or "1 dozen." This helps customers understand exactly what they're buying.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    question: "How do I manage my product inventory?",
    answer: (
      <div className="space-y-4">
        <p>
          Keeping your stock levels accurate is crucial. We have two main ways to manage your products:
        </p>
        <ul className="list-decimal list-inside space-y-3">
          <li>
            <strong>For quick, bulk updates:</strong> The{" "}
            <Link to="/update-quantity" className="text-primary font-semibold hover:underline">
              Update Qty
            </Link>{" "}
            page is your best friend. It's designed for speed. "Scan" a product and use the quick-action buttons or type in a number to add to or replace the current stock count.
          </li>
          <li>
            <strong>For detailed changes:</strong> To change a product's name, price, description, or photos, go to the product's page and click the{" "}
            <span className="inline-flex items-center gap-1 font-semibold"><Edit className="h-4 w-4" />Edit</span> button. You can also hide or delete the product from this page.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "How do I handle my orders?",
    answer: (
      <div className="space-y-4">
        <p>
          All your sales are organized on the{" "}
          <Link to="/orders" className="text-primary font-semibold hover:underline">
            Orders
          </Link>{" "}
          page. You can see orders for today, tomorrow, or any other day using the calendar.
        </p>
        <div className="flex items-start gap-3">
          <ClipboardCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Understanding Order Statuses:</h4>
            <p className="text-sm text-muted-foreground">
              Each order has a status to help you track its progress: <span className="font-semibold text-foreground">Pending</span> (new order), <span className="font-semibold text-foreground">Ready for Pickup</span> (you've prepared it), and <span className="font-semibold text-foreground">Completed</span> (the customer has it).
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "How do my earnings and payments work?",
    answer: (
      <div className="space-y-4">
        <p>
          You can track all your finances on the{" "}
          <Link to="/revenue" className="text-primary font-semibold hover:underline">
            Revenue
          </Link>{" "}
          page. It shows your total sales, the platform's commission, and your net earnings.
        </p>
        <div className="flex items-start gap-3">
          <Banknote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Payouts:</h4>
            <p className="text-sm text-muted-foreground">
              The "To Be Paid" section shows the amount for your next payout. The payment history table below gives a detailed breakdown of all past transactions and their status.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "How should I interact with customer reviews?",
    answer: (
      <div className="space-y-4">
        <p>
          Engaging with reviews on the{" "}
          <Link to="/my-reviews" className="text-primary font-semibold hover:underline">
            My Reviews
          </Link>{" "}
          page helps build customer trust and loyalty.
        </p>
        <ul className="list-none space-y-3">
          <li className="flex items-start gap-3">
            <MessageSquareHeart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Public vs. Private Replies:</h4>
              <p className="text-sm text-muted-foreground">
                Use a <strong className="text-foreground">Public Reply</strong> to thank customers or address feedback that others might find helpful. Use a <strong className="text-foreground">Private Reply</strong> to resolve a specific issue directly with a customer or to send a personal thank you note.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Inappropriate Reviews:</h4>
              <p className="text-sm text-muted-foreground">
                If you receive a review that is spam, abusive, or not relevant, you can use the "Report" option. Our team will investigate it.
              </p>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
];

const FAQ = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <BackButton />
      <AppBreadcrumb />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Help & Support</h1>
        <p className="text-muted-foreground text-center mb-8">
          Your guide to managing your seller profile, products, and sales.
        </p>

        {/* New Card for Support Number */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Need More Help?</CardTitle>
            <Phone className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-2">
              If you can't find what you're looking for, feel free to call our support team.
            </p>
            <a href="tel:+49123456789" className="text-2xl font-bold text-primary hover:underline">
              +49 123 456789
            </a>
            <p className="text-xs text-muted-foreground mt-1">Available Mon-Fri, 9 AM - 5 PM CET</p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-primary">
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
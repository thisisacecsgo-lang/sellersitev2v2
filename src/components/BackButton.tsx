import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // This checks if there is a page to go back to in the history
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true }); // Fallback to home page
    }
  };

  return (
    <Button variant="outline" onClick={handleBack} className="mb-6">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Go Back
    </Button>
  );
};

export default BackButton;
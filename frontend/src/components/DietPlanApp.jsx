import { useState } from "react";
import axios from "axios";
import { Loader, Clipboard, Check } from "lucide-react";


const DietPlanApp = () => {
  const [preferences, setPreferences] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goals, setGoals] = useState(""); // Updated: Now user-defined
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDietPlan(null);
    setCopied(false);

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_BACKENDURL}/api/diet-plan`, {
        preferences,
        healthIssues,
        activityLevel,
        goals,
      });
      setDietPlan(response.data.dietPlan);
    } catch (error) {
      console.error("Error fetching diet plan:", error);
      alert("Failed to generate the diet plan. Please try again later.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(dietPlan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">🥗 Diet Plan Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Preferences</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Vegan, Gluten-free"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Health Issues</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Diabetes, High BP"
              value={healthIssues}
              onChange={(e) => setHealthIssues(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Activity Level</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Goals</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Weight loss, Muscle gain, Balanced diet"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : "Generate Plan"}
          </button>
        </form>

        {dietPlan && (
          <div className="mt-6 p-5 bg-gray-100 rounded-xl border border-gray-300 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🍽️ Your Diet Plan</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4">Meal Type</th>
                    <th className="py-2 px-4">Meal</th>
                    <th className="py-2 px-4">Calories (kcal)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Breakfast</td>
                    <td className="py-2 px-4">{dietPlan.breakfast.meal}</td>
                    <td className="py-2 px-4">{dietPlan.breakfast.calories}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Lunch</td>
                    <td className="py-2 px-4">{dietPlan.lunch.meal}</td>
                    <td className="py-2 px-4">{dietPlan.lunch.calories}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Dinner</td>
                    <td className="py-2 px-4">{dietPlan.dinner.meal}</td>
                    <td className="py-2 px-4">{dietPlan.dinner.calories}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Snacks</td>
                    <td colSpan="2" className="py-2 px-4">
                      <ul className="list-disc ml-6">
                        {dietPlan.snacks.map((snack, index) => (
                          <li key={index}>{snack.snack} ({snack.calories} kcal)</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="py-2 px-4 font-semibold">Total Calories</td>
                    <td colSpan="2" className="py-2 px-4">{dietPlan.total_calories} kcal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button 
              onClick={handleCopy} 
              className="mt-4 bg-green-500 text-white p-2 rounded-lg shadow-md flex items-center justify-center"
            >
              {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />} Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanApp;

import { motion, AnimatePresence } from "framer-motion";
function BenefitsCard() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="step1"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4 }}
      ></motion.div>
    </AnimatePresence>
  );
}

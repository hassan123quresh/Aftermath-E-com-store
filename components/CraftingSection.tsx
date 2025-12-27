import React from 'react';
import { ParallaxScroll } from './ParallaxScroll';

const baseImages = [
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862689/The_collection_is_built_on_the_belief_that_less_holds_its_own_power._Every_element_is_placed_wit_gvuz57.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862689/Every_detail_comes_from_quiet_curation_and_time._Months_of_work_shaped_by_intention_and_precisio_aqlfs0.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862689/Blanks_on_purpose_shaped_so_the_silhouette_speaks._What_you_do_in_them_is_the_story.One_day_to_pyouqw.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862689/The_experience_begins_long_before_the_product_is_worn._Every_detail_is_considered_to_add_depth_rfnorg.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862688/Studio_cut_sizes_are_not_sloppy_or_just_hanging_down._They_are_curated_in_a_pattern_that_lets_th_1_dxpxcp.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862688/It_starts_with_a_line._hmuzco.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862688/Studio_cut_sizes_are_not_sloppy_or_just_hanging_down._They_are_curated_in_a_pattern_that_lets_th_setkrh.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862688/Studio_cut_sizes_are_not_sloppy_or_just_hanging_down._They_are_curated_in_a_pattern_that_lets_th_2_o3c2rx.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862688/A_good_brand_is_more_than_a_name._It_is_how_the_whole_thing_makes_you_feel_without_trying_too_ha_dl9jpg.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862688/Studio_cut_sizes_are_not_sloppy_or_just_hanging_down._They_are_curated_in_a_pattern_that_lets_th_3_iqgm7w.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862687/A_good_brand_is_more_than_a_name._It_is_how_the_whole_thing_makes_you_feel_without_trying_too_ha_1_gitzes.jpg",
  "https://res.cloudinary.com/dacyy7rkn/image/upload/v1766862689/The_collection_is_built_on_the_belief_that_less_holds_its_own_power._Every_element_is_placed_wit_gvuz57.jpg"
];

// Duplicate the array to ensure a dense, fully populated grid
const images = [...baseImages, ...baseImages];

const CraftingSection = () => {
  return (
    <div className="w-full bg-[#1A1A1A] relative py-20 md:py-32 overflow-hidden border-t border-white/5">
        {/* Aesthetic Grey Noise Texture */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Radial Vignette for Depth */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1A1A1A_100%)] opacity-80 pointer-events-none"></div>

        <div className="relative z-10 px-6 md:px-12 mb-8 md:mb-16 text-center">
             <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 block animate-fade-in">Behind the Seams</span>
             <h2 className="font-serif text-4xl md:text-6xl text-stone-100 mb-6 animate-fade-in-up">Crafted with Intention</h2>
             <p className="max-w-xl mx-auto text-sm text-stone-400 leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Every silhouette begins with a line. Every fabric is chosen for its weight, its drape, and its silence. 
                This is not just manufacturing; it is a deliberate act of reduction until only the essential remains.
             </p>
        </div>
        
        <div className="relative z-10">
           <ParallaxScroll images={images} />
        </div>
    </div>
  )
}

export default CraftingSection;

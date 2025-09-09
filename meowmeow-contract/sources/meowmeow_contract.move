module 0x0::meowmeow_contract;

use std::string::{Self, String};
use sui::{clock::Clock, display, dynamic_field, event, package, random::{Random, RandomGenerator}};


// === Errors ===
const E_NOT_ENOUGH_COINS: u64 = 101;
const E_PET_NOT_HUNGRY: u64 = 102;
const E_PET_TOO_TIRED: u64 = 103;
const E_PET_TOO_HUNGRY: u64 = 104;
const E_ITEM_ALREADY_EQUIPPED: u64 = 105;
const E_NO_ITEM_EQUIPPED: u64 = 106;
const E_NOT_ENOUGH_EXP: u64 = 107;
const E_PET_IS_ASLEEP: u64 = 108;
const E_PET_IS_ALREADY_ASLEEP: u64 = 109;
const E_PET_TOO_SAD: u64 = 110;
const E_PET_LEVEL_TOO_LOW: u64 = 111;
const E_PET_NOT_HAPPY_ENOUGH: u64 = 112;
const E_BREEDING_COOLDOWN: u64 = 113;
const E_SAME_PET: u64 = 114;

// === Constants ===
const PET_LEVEL_1_IMAGE_URL: vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidkhjpthergw2tcg6u5r344shgi2cdg5afmhgpf5bv34vqfrr7hni";
const PET_LEVEL_1_IMAGE_WITH_GLASSES_URL: vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreibizappmcjaq5a5metl27yc46co4kxewigq6zu22vovwvn5qfsbiu";
const PET_LEVEL_2_IMAGE_URL: vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreia5tgsowzfu6mzjfcxagfpbkghfuho6y5ybetxh3wabwrc5ajmlpq";
const PET_LEVEL_2_IMAGE_WITH_GLASSES_URL:vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreif5bkpnqyybq3aqgafqm72x4wfjwcuxk33vvykx44weqzuilop424";
const PET_LEVEL_3_IMAGE_URL: vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidnqerfwxuxkrdsztgflmg5jwuespdkrazl6qmk7ykfgmrfzvinoy";
const PET_LEVEL_3_IMAGE_WITH_GLASSES_URL:vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreigs6r3rdupoji7pqmpwe76z7wysguzdlq43t3wqmzi2654ux5n6uu";
const PET_SLEEP_IMAGE_URL: vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreihwofl5stihtzjixfhrtznd7zqkclfhmlshgsg7cbszzjqqpvf7ae";
const ACCESSORY_GLASSES_IMAGE_URL: vector<u8> = b"https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreigyivmq45od3jkryryi3w6t5j65hcnfh5kgwpi2ex7llf2i6se7de";

const EQUIPPED_ITEM_KEY: vector<u8> = b"equipped_item";
const SLEEP_STARTED_AT_KEY: vector<u8> = b"sleep_started_at";
const LAST_BRED_AT_KEY: vector<u8> = b"last_bred_at";


// === Game Balance ===
public struct GameBalance has copy, drop {
    max_stat: u8,

    // Feed settings
    feed_coins_cost: u64,
    feed_experience_gain: u64,
    feed_hunger_gain: u8,

    // Play settings
    play_energy_loss: u8,
    play_hunger_loss: u8,
    play_experience_gain: u64,
    play_happiness_gain: u8,

    // Work settings
    work_energy_loss: u8,
    work_happiness_loss: u8,
    work_hunger_loss: u8,
    work_coins_gain: u64,
    work_experience_gain: u64,

    // Sleep settings (in milliseconds)
    sleep_energy_gain_ms: u64,
    sleep_happiness_loss_ms: u64,
    sleep_hunger_loss_ms: u64,

    // Level settings
    exp_per_level: u64,

    // Breeding settings
    breed_coins_cost: u64,
    breed_min_level: u8,
    breed_min_happiness: u8,
    breed_cooldown_ms: u64, // 24 hours in milliseconds
}

fun get_game_balance(): GameBalance {
    GameBalance {
        max_stat: 100,

        // Feed
        feed_coins_cost: 5,
        feed_experience_gain: 5,
        feed_hunger_gain: 20,

        // Play
        play_energy_loss: 15,
        play_hunger_loss: 15,
        play_experience_gain: 10,
        play_happiness_gain: 25,

        // Work
        work_energy_loss: 20,
        work_hunger_loss: 20,
        work_happiness_loss: 20,
        work_coins_gain: 25,
        work_experience_gain: 15,

        // Sleep (rates per millisecond)
        sleep_energy_gain_ms: 1000,    // 1 energy per second
        sleep_happiness_loss_ms: 700, // 1 happiness loss per 0.7 seconds
        sleep_hunger_loss_ms: 500,    // 1 hunger loss per 0.5 seconds

        // Level
        exp_per_level: 100,

        // Breeding
        breed_coins_cost: 50,     // Cost per pet (total 100 coins)
        breed_min_level: 2,       // Minimum level 2
        breed_min_happiness: 70,  // Minimum 70 happiness
        breed_cooldown_ms: 86400000, // 24 hours in milliseconds
    }
}


public struct MEOWMEOW_CONTRACT has drop {}

public struct Pet has key, store {
    id: UID,
    name: String,
    image_url: String,
    adopted_at: u64,
    stats: PetStats,
    game_data: PetGameData,
}

public struct PetAccessory has key, store {
    id: UID,
    name: String,
    image_url: String
}

public struct PetStats has store {
    energy: u8,
    happiness: u8,
    hunger: u8,
}

public struct PetGameData has store {
    coins: u64,
    experience: u64,
    level: u8,
}


// === Events ===
public struct PetAdopted has copy, drop {
    pet_id: ID,
    name: String,
    adopted_at: u64
}

public struct PetAction has copy, drop {
    pet_id: ID,
    action: String,
    energy: u8,
    happiness: u8,
    hunger: u8
}

public struct PetBred has copy, drop {
    parent1_id: ID,
    parent2_id: ID,
    offspring_id: ID,
    offspring_name: String,
    bred_at: u64
}

fun init(witness: MEOWMEOW_CONTRACT, ctx: &mut TxContext) {
    let publisher = package::claim(witness, ctx);

    let pet_keys = vector[
        string::utf8(b"name"),
        string::utf8(b"image_url"),
        string::utf8(b"birth_date"),
        string::utf8(b"experience"),
        string::utf8(b"level"),
    ];

    let pet_values = vector[
        string::utf8(b"{name}"),
        string::utf8(b"{image_url}"),
        string::utf8(b"{adopted_at}"),
        string::utf8(b"{game_data.experience}"),
        string::utf8(b"{game_data.level}"),
    ];

    let mut pet_display = display::new_with_fields<Pet>(&publisher, pet_keys, pet_values, ctx);
    pet_display.update_version();
    transfer::public_transfer(pet_display, ctx.sender());

    let accessory_keys = vector[
        string::utf8(b"name"),
        string::utf8(b"image_url")
    ];
    let accessory_values = vector[
        string::utf8(b"{name}"),
        string::utf8(b"{image_url}")
    ];
    let mut accessory_display = display::new_with_fields<PetAccessory>(&publisher, accessory_keys, accessory_values, ctx);
    accessory_display.update_version();
    transfer::public_transfer(accessory_display, ctx.sender());

    transfer::public_transfer(publisher, ctx.sender());
}


public fun adopt_pet(
    name: String,
    clock: &Clock,
    ctx: &mut TxContext
): Pet {
    let current_time = clock.timestamp_ms();

    let pet_stats = PetStats {
        energy: 60,
        happiness: 50,
        hunger: 40,
    };

    let pet_game_data = PetGameData {
        coins: 20,
        experience: 0,
        level: 1
    };

    let pet = Pet {
        id: object::new(ctx),
        name,
        image_url: string::utf8(PET_LEVEL_1_IMAGE_URL),
        adopted_at: current_time,
        stats: pet_stats,
        game_data: pet_game_data
    };

    let pet_id = object::id(&pet);

    event::emit(PetAdopted {
        pet_id: pet_id,
        name: pet.name,
        adopted_at: pet.adopted_at
    });

    pet
}


public fun feed_pet(pet: &mut Pet) {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    let gb = get_game_balance();

    assert!(pet.stats.hunger < gb.max_stat, E_PET_NOT_HUNGRY);
    assert!(pet.game_data.coins >= gb.feed_coins_cost, E_NOT_ENOUGH_COINS);

    pet.game_data.coins = pet.game_data.coins - gb.feed_coins_cost;
    pet.game_data.experience = pet.game_data.experience + gb.feed_experience_gain;
    pet.stats.hunger = if (pet.stats.hunger + gb.feed_hunger_gain > gb.max_stat)
        gb.max_stat
    else
        pet.stats.hunger + gb.feed_hunger_gain;

    emit_action(pet, b"fed");
}


public fun play_with_pet(pet: &mut Pet) {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    let gb = get_game_balance();
    assert!(pet.stats.energy >= gb.play_energy_loss, E_PET_TOO_TIRED);
    assert!(pet.stats.hunger >= gb.play_hunger_loss, E_PET_TOO_HUNGRY);

    pet.stats.energy = pet.stats.energy - gb.play_energy_loss;
    pet.stats.hunger = pet.stats.hunger - gb.play_hunger_loss;
    pet.game_data.experience = pet.game_data.experience + gb.play_experience_gain;
    pet.stats.happiness = if (pet.stats.happiness + gb.play_happiness_gain > gb.max_stat)
        gb.max_stat
    else
        pet.stats.happiness + gb.play_happiness_gain;

    emit_action(pet, b"played");
}



public fun work_for_coins(pet: &mut Pet) {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    let gb = get_game_balance();

    assert!(pet.stats.energy >= gb.work_energy_loss, E_PET_TOO_TIRED);
    assert!(pet.stats.happiness >= gb.work_happiness_loss, E_PET_TOO_SAD);
    assert!(pet.stats.hunger >= gb.work_hunger_loss, E_PET_TOO_HUNGRY);

    pet.stats.energy = if (pet.stats.energy >= gb.work_energy_loss)
        pet.stats.energy - gb.work_energy_loss
    else
        0;
    pet.stats.happiness = if (pet.stats.happiness >= gb.work_happiness_loss)
        pet.stats.happiness - gb.work_happiness_loss
    else
        0;
    pet.stats.hunger = if (pet.stats.hunger >= gb.work_hunger_loss)
        pet.stats.hunger - gb.work_hunger_loss
    else
        0;
    pet.game_data.coins = pet.game_data.coins + gb.work_coins_gain;
    pet.game_data.experience = pet.game_data.experience + gb.work_experience_gain;

    emit_action(pet, b"worked");
}


public fun check_and_level_up(pet: &mut Pet) {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    let gb = get_game_balance();

    // Calculate required exp: level * exp_per_level
    let required_exp = (pet.game_data.level as u64) * gb.exp_per_level;
    assert!(pet.game_data.experience >= required_exp, E_NOT_ENOUGH_EXP);

    // Level up
    pet.game_data.level = pet.game_data.level + 1;
    pet.game_data.experience = pet.game_data.experience - required_exp;

    // Update image based on level and equipped accessory
    update_pet_image(pet);

    emit_action(pet, b"leveled_up")
}


public fun beg_for_coins(pet: &mut Pet) {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    // Give free coins when pet is stuck (no coins, low happiness, low hunger)
    if (pet.game_data.coins < 5 && pet.stats.happiness < 20 && pet.stats.hunger < 20) {
        pet.game_data.coins = pet.game_data.coins + 10;
        emit_action(pet, b"begged_for_coins");
    }
}


// === PTB Combined Actions ===
public fun eat_work_sleep_combo(pet: &mut Pet, clock: &Clock) {
    let gb = get_game_balance();
    
    // Check initial conditions
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);
    
    // First feed the pet (check if needed and possible)
    assert!(pet.stats.hunger < gb.max_stat, E_PET_NOT_HUNGRY);
    assert!(pet.game_data.coins >= gb.feed_coins_cost, E_NOT_ENOUGH_COINS);
    feed_pet(pet);
    
    // Then work for coins (check conditions after feeding)
    assert!(pet.stats.energy >= gb.work_energy_loss, E_PET_TOO_TIRED);
    assert!(pet.stats.happiness >= gb.work_happiness_loss, E_PET_TOO_SAD);
    assert!(pet.stats.hunger >= gb.work_hunger_loss, E_PET_TOO_HUNGRY);
    work_for_coins(pet);
    
    // Finally let the pet sleep
    let_pet_sleep(pet, clock);
    
    emit_action(pet, b"eat_work_sleep_combo");
}

public fun wake_eat_work_combo(pet: &mut Pet, clock: &Clock) {
    let gb = get_game_balance();
    
    // First wake up the pet (only if sleeping)
    if (is_sleeping(pet)) {
        wake_up_pet(pet, clock);
    };
    
    // Then feed the pet (only if needed and possible)
    if (pet.stats.hunger < gb.max_stat && pet.game_data.coins >= gb.feed_coins_cost) {
        feed_pet(pet);
    };
    
    // Check if pet can work after waking up and feeding
    // Only work if all conditions are met, otherwise just complete wake/feed actions
    if (pet.stats.energy >= gb.work_energy_loss &&
        pet.stats.happiness >= gb.work_happiness_loss &&
        pet.stats.hunger >= gb.work_hunger_loss) {
        work_for_coins(pet);
        emit_action(pet, b"wake_eat_work_combo");
    } else {
        // Pet can't work, but wake and feed were successful
        emit_action(pet, b"wake_eat_partial");
    };
}


// === Breeding System ===
public fun breed_pets(
    parent1: &mut Pet,
    parent2: &mut Pet,
    offspring_name: String,
    clock: &Clock,
    random: &Random,
    ctx: &mut TxContext
): Pet {
    let gb = get_game_balance();
    let current_time = clock.timestamp_ms();
    
    // Validate that pets are different
    assert!(object::id(parent1) != object::id(parent2), E_SAME_PET);
    
    // Check breeding conditions for both parents
    validate_breeding_conditions(parent1, &gb, current_time);
    validate_breeding_conditions(parent2, &gb, current_time);
    
    // Pay breeding costs for both parents
    parent1.game_data.coins = parent1.game_data.coins - gb.breed_coins_cost;
    parent2.game_data.coins = parent2.game_data.coins - gb.breed_coins_cost;
    
    // Set breeding cooldown for both parents
    let cooldown_key = string::utf8(LAST_BRED_AT_KEY);
    if (dynamic_field::exists_<String>(&parent1.id, cooldown_key)) {
        *dynamic_field::borrow_mut<String, u64>(&mut parent1.id, cooldown_key) = current_time;
    } else {
        dynamic_field::add(&mut parent1.id, cooldown_key, current_time);
    };
    
    if (dynamic_field::exists_<String>(&parent2.id, cooldown_key)) {
        *dynamic_field::borrow_mut<String, u64>(&mut parent2.id, cooldown_key) = current_time;
    } else {
        dynamic_field::add(&mut parent2.id, cooldown_key, current_time);
    };
    
    // Generate offspring stats (average of parents + random bonus)
    let mut generator = random.new_generator(ctx);
    let offspring_stats = generate_offspring_stats(parent1, parent2, &mut generator);
    
    // Create offspring
    let offspring = Pet {
        id: object::new(ctx),
        name: offspring_name,
        image_url: string::utf8(PET_LEVEL_1_IMAGE_URL),
        adopted_at: current_time,
        stats: offspring_stats,
        game_data: PetGameData {
            coins: 10, // Start with 10 coins
            experience: 0,
            level: 1
        }
    };
    
    // Emit breeding event
    event::emit(PetBred {
        parent1_id: object::id(parent1),
        parent2_id: object::id(parent2),
        offspring_id: object::id(&offspring),
        offspring_name: offspring.name,
        bred_at: current_time
    });
    
    offspring
}

fun validate_breeding_conditions(pet: &Pet, gb: &GameBalance, current_time: u64) {
    // Pet must not be sleeping
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);
    
    // Pet must be at least level 2
    assert!(pet.game_data.level >= gb.breed_min_level, E_PET_LEVEL_TOO_LOW);
    
    // Pet must have enough happiness
    assert!(pet.stats.happiness >= gb.breed_min_happiness, E_PET_NOT_HAPPY_ENOUGH);
    
    // Pet must have enough coins
    assert!(pet.game_data.coins >= gb.breed_coins_cost, E_NOT_ENOUGH_COINS);
    
    // Check breeding cooldown
    let cooldown_key = string::utf8(LAST_BRED_AT_KEY);
    if (dynamic_field::exists_<String>(&pet.id, cooldown_key)) {
        let last_bred_at = *dynamic_field::borrow<String, u64>(&pet.id, cooldown_key);
        let time_since_breed = current_time - last_bred_at;
        assert!(time_since_breed >= gb.breed_cooldown_ms, E_BREEDING_COOLDOWN);
    };
}

fun generate_offspring_stats(parent1: &Pet, parent2: &Pet, generator: &mut RandomGenerator): PetStats {
    // Calculate average stats from parents
    let avg_energy = ((parent1.stats.energy as u16) + (parent2.stats.energy as u16)) / 2;
    let avg_happiness = ((parent1.stats.happiness as u16) + (parent2.stats.happiness as u16)) / 2;
    let avg_hunger = ((parent1.stats.hunger as u16) + (parent2.stats.hunger as u16)) / 2;
    
    // Add random variation (-10 to +10)
    let energy_variation = (generator.generate_u8() % 21); // 0 to 20
    let happiness_variation = (generator.generate_u8() % 21);
    let hunger_variation = (generator.generate_u8() % 21);
    
    // Apply variations safely
    let final_energy = if (energy_variation > 10) {
        clamp_stat_add(avg_energy, energy_variation - 10)
    } else {
        clamp_stat_sub(avg_energy, 10 - energy_variation)
    };
    
    let final_happiness = if (happiness_variation > 10) {
        clamp_stat_add(avg_happiness, happiness_variation - 10)
    } else {
        clamp_stat_sub(avg_happiness, 10 - happiness_variation)
    };
    
    let final_hunger = if (hunger_variation > 10) {
        clamp_stat_add(avg_hunger, hunger_variation - 10)
    } else {
        clamp_stat_sub(avg_hunger, 10 - hunger_variation)
    };
    
    PetStats {
        energy: final_energy,
        happiness: final_happiness,
        hunger: final_hunger,
    }
}

fun clamp_stat_add(base: u16, bonus: u8): u8 {
    let result = base + (bonus as u16);
    if (result > 100) 100
    else (result as u8)
}

fun clamp_stat_sub(base: u16, penalty: u8): u8 {
    let penalty_u16 = penalty as u16;
    if (base <= penalty_u16) 1
    else {
        let result = base - penalty_u16;
        if (result < 1) 1
        else (result as u8)
    }
}


public fun let_pet_sleep(pet: &mut Pet, clock: &Clock) {
    assert!(!is_sleeping(pet), E_PET_IS_ALREADY_ASLEEP);

    let key = string::utf8(SLEEP_STARTED_AT_KEY);
    dynamic_field::add(&mut pet.id, key, clock.timestamp_ms());

    pet.image_url = string::utf8(PET_SLEEP_IMAGE_URL);

    emit_action(pet, b"started_sleeping");
}

public fun wake_up_pet(pet: &mut Pet, clock: &Clock) {
    assert!(is_sleeping(pet), E_PET_IS_ASLEEP);

    let key = string::utf8(SLEEP_STARTED_AT_KEY);
    let sleep_started_at: u64 = dynamic_field::remove<String, u64>(&mut pet.id, key);
    let duration_ms = clock.timestamp_ms() - sleep_started_at;

    let gb = get_game_balance();

    // Calculate energy gained
    let energy_gained_u64 = duration_ms / gb.sleep_energy_gain_ms;
    let energy_gained = if (energy_gained_u64 > (gb.max_stat as u64)) {
        gb.max_stat
    } else {
        (energy_gained_u64 as u8)
    };
    pet.stats.energy = if (pet.stats.energy + energy_gained > gb.max_stat) gb.max_stat else pet.stats.energy + energy_gained;

    // Calculate happiness lost
    let happiness_lost_u64 = duration_ms / gb.sleep_happiness_loss_ms;
    let happiness_lost = if (happiness_lost_u64 > (gb.max_stat as u64)) {
        gb.max_stat
    } else {
        (happiness_lost_u64 as u8)
    };
    pet.stats.happiness = if (pet.stats.happiness > happiness_lost) pet.stats.happiness - happiness_lost else 0;

    // Calculate hunger lost
    let hunger_lost_u64 = duration_ms / gb.sleep_hunger_loss_ms;
    let hunger_lost = if (hunger_lost_u64 > (gb.max_stat as u64)) {
        gb.max_stat
    } else {
        (hunger_lost_u64 as u8)
    };
    pet.stats.hunger = if (pet.stats.hunger > hunger_lost) pet.stats.hunger - hunger_lost else 0;

    update_pet_image(pet);

    emit_action(pet, b"woke_up");
}



public fun mint_accessory(ctx: &mut TxContext): PetAccessory {
    let accessory = PetAccessory {
        id: object::new(ctx),
        name: string::utf8(b"cool glasses"),
        image_url: string::utf8(ACCESSORY_GLASSES_IMAGE_URL)
    };
    accessory
}

public fun equip_accessory(pet: &mut Pet, accessory: PetAccessory) {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    let key = string::utf8(EQUIPPED_ITEM_KEY);
    assert!(!dynamic_field::exists_<String>(&pet.id, copy key), E_ITEM_ALREADY_EQUIPPED);

    // Add accessory to pet
    dynamic_field::add(&mut pet.id, key, accessory);
    // Update image
    update_pet_image(pet);
    emit_action(pet, b"equipped_item");
}

public fun unequip_accessory(pet: &mut Pet, _ctx: &mut TxContext): PetAccessory {
    assert!(!is_sleeping(pet), E_PET_IS_ASLEEP);

    let key = string::utf8(EQUIPPED_ITEM_KEY);
    assert!(dynamic_field::exists_<String>(&pet.id, key), E_NO_ITEM_EQUIPPED);

    // Remove accessory
    let accessory: PetAccessory = dynamic_field::remove<String, PetAccessory>(&mut pet.id, key);
    // Update image
    update_pet_image(pet);

    emit_action(pet, b"unequipped_item");
    accessory
}


// === Helper Functions ===
fun emit_action(pet: &Pet, action: vector<u8>) {
    event::emit(PetAction {
        pet_id: object::id(pet),
        action: string::utf8(action),
        energy: pet.stats.energy,
        happiness: pet.stats.happiness,
        hunger: pet.stats.hunger,
    });
}

fun update_pet_image(pet: &mut Pet) {
    let key = string::utf8(EQUIPPED_ITEM_KEY);
    let has_accessory = dynamic_field::exists_<String>(&pet.id, key);

    if (pet.game_data.level == 1) {
        if (has_accessory) {
            pet.image_url = string::utf8(PET_LEVEL_1_IMAGE_WITH_GLASSES_URL);
        } else {
            pet.image_url = string::utf8(PET_LEVEL_1_IMAGE_URL);
        }
    } else if (pet.game_data.level == 2) {
        if (has_accessory) {
            pet.image_url = string::utf8(PET_LEVEL_2_IMAGE_WITH_GLASSES_URL);
        } else {
            pet.image_url = string::utf8(PET_LEVEL_2_IMAGE_URL);
        }
    } else if (pet.game_data.level >= 3) {
        if (has_accessory) {
            pet.image_url = string::utf8(PET_LEVEL_3_IMAGE_WITH_GLASSES_URL);
        } else {
            pet.image_url = string::utf8(PET_LEVEL_3_IMAGE_URL);
        }
    };
}


// === View Functions ===
public fun get_pet_name(pet: &Pet): String { pet.name }
public fun get_pet_adopted_at(pet: &Pet): u64 { pet.adopted_at }
public fun get_pet_coins(pet: &Pet): u64 { pet.game_data.coins }
public fun get_pet_experience(pet: &Pet): u64 { pet.game_data.experience }
public fun get_pet_level(pet: &Pet): u8 { pet.game_data.level }
public fun get_pet_energy(pet: &Pet): u8 { pet.stats.energy }
public fun get_pet_hunger(pet: &Pet): u8 { pet.stats.hunger }
public fun get_pet_happiness(pet: &Pet): u8 { pet.stats.happiness }

public fun get_pet_stats(pet: &Pet): (u8, u8, u8) {
    (pet.stats.energy, pet.stats.hunger, pet.stats.happiness)
}
public fun get_pet_game_data(pet: &Pet): (u64, u64, u8) {
    (pet.game_data.coins, pet.game_data.experience, pet.game_data.level)
}

public fun is_sleeping(pet: &Pet): bool {
    let key = string::utf8(SLEEP_STARTED_AT_KEY);
    dynamic_field::exists_<String>(&pet.id, key)
}

public fun can_breed(pet: &Pet, clock: &Clock): bool {
    let gb = get_game_balance();
    let current_time = clock.timestamp_ms();
    
    // Check basic requirements
    if (is_sleeping(pet) ||
        pet.game_data.level < gb.breed_min_level ||
        pet.stats.happiness < gb.breed_min_happiness ||
        pet.game_data.coins < gb.breed_coins_cost) {
        return false
    };
    
    // Check breeding cooldown
    let cooldown_key = string::utf8(LAST_BRED_AT_KEY);
    if (dynamic_field::exists_<String>(&pet.id, cooldown_key)) {
        let last_bred_at = *dynamic_field::borrow<String, u64>(&pet.id, cooldown_key);
        let time_since_breed = current_time - last_bred_at;
        if (time_since_breed < gb.breed_cooldown_ms) {
            return false
        };
    };
    
    true
}

public fun get_breeding_cooldown_remaining(pet: &Pet, clock: &Clock): u64 {
    let gb = get_game_balance();
    let current_time = clock.timestamp_ms();
    let cooldown_key = string::utf8(LAST_BRED_AT_KEY);
    
    if (!dynamic_field::exists_<String>(&pet.id, cooldown_key)) {
        return 0 // No cooldown
    };
    
    let last_bred_at = *dynamic_field::borrow<String, u64>(&pet.id, cooldown_key);
    let time_since_breed = current_time - last_bred_at;
    
    if (time_since_breed >= gb.breed_cooldown_ms) {
        0 // Cooldown expired
    } else {
        gb.breed_cooldown_ms - time_since_breed // Remaining time
    }
}



// === Test-Only Functions ===
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(MEOWMEOW_CONTRACT {}, ctx);
}
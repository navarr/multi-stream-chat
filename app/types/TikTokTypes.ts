/*
From: https://github.com/isaackogan/TikTokLive/tree/master/scripts/typescript
Modifications (where used) to replace underscore_format with camelCaseFormat for Euler FC
*/

export enum AuditStatus {
    AUDITSTATUSUNKNOWN = 0,
    AUDITSTATUSPASS = 1,
    AUDITSTATUSFAILED = 2,
    AUDITSTATUSREVIEWING = 3,
    AUDITSTATUSFORBIDDEN = 4,
}

export enum EmoteType {
    EMOTETYPENORMAL = 0,
    EMOTETYPEWITHSTICKER = 1,
}

export enum ContentSource {
    CONTENTSOURCEUNKNOWN = 0,
    CONTENTSOURCENORMAL = 1,
    CONTENTSOURCECAMERA = 2,
}

export enum EmotePrivateType {
    NORMAL = 0,
    SUB_WAVE = 1,
}

export enum TextType {
    DISPLAY_TEXT = 0,
    CONTENT = 1,
}

export enum LinkmicApplierSortSetting {
    NONE = 0,
    BY_GIFT_SCORE = 1,
}

export enum HashtagNamespace {
    GLOBAL = 0,
    GAMING = 1,
}

export enum AgreeStatus {
    AGREE_UNKNOWN = 0,
    AGREE = 1,
    REJECT = 2,
}

export enum KickoutReason {
    UNKNOWN = 0,
    FIRST_FRAME_TIMEOUT = 1,
    BY_HOST = 2,
    RTC_LOST_CONNECTION = 3,
    BY_PUNISH = 4,
    BY_ADMIN = 5,
    HOST_REMOVE_ALL_GUESTS = 6,
}

export enum GroupStatus {
    UNKNOWN = 0,
    WAITING = 1,
    LINKED = 3,
}

export enum BusinessCase {
    BUSINESS_NOT_SET = 0,
    APPLY_BIZ_CONTENT = 1,
    INVITE_BIZ_CONTENT = 2,
    REPLY_BIZ_CONTENT = 3,
    PERMIT_BIZ_CONTENT = 4,
    JOIN_DIRECT_BIZ_CONTENT = 5,
    KICK_OUT_BIZ_CONTENT = 6,
    LIST_CHANGE_BIZ_CONTENT = 11,
    MULTI_LIVE_CONTENT = 100,
    COHOST_CONTENT = 200,
}

export enum ReplyStatus {
    UNKNOWN = 0,
    AGREE = 1,
    REFUSE_PERSONALLY = 2,
    REFUSE_TYPE_NOT_SUPPORT = 3,
    REFUSE_PROCESSING_INVITATION = 4,
    REFUSE_BY_TIMEOUT = 5,
    REFUSE_EXCEPTION = 6,
    REFUSE_SYSTEM_NOT_SUPPORTED = 7,
    REFUSE_SUBTYPE_DIFFERENCE = 8,
    REFUSE_IN_MICROOM = 9,
    REFUSE_NOT_LOAD_PLUGIN = 10,
    REFUSE_IN_MULTI_GUEST = 11,
    REFUSE_PAUSE_LIVE = 12,
    REFUSE_OPEN_CAMERA_DIALOG_SHOWING = 13,
    REFUSE_DRAW_GUESSING = 14,
    REFUSE_RANDOM_MATCHING = 15,
    REFUSE_IN_MATCH_PROCESSING = 16,
    REFUSE_IN_MICROOM_FOR_MULTI_COHOST = 17,
    REFUSE_COHOST_FINISHED = 18,
    REFUSE_NOT_CONNECTED = 19,
    REFUSE_LINKMIC_FULL = 20,
    REFUSE_ARC_INCOMPATIBLE = 21,
    REFUSE_PROCESSING_OTHER_INVITE = 22,
    REFUSE_PROCESSING_OTHER_APPLY = 23,
    REFUSE_IN_ANCHOR_COHOST = 24,
    REFUSE_TOPIC_PAIRING = 25,
}

export enum SubscribeType {
    SUBSCRIBETYPE_ONCE = 0,
    SUBSCRIBETYPE_AUTO = 1,
    SUBSCRIBETYPE_DEFAULT = 100,
}

export enum OldSubscribeStatus {
    OLDSUBSCRIBESTATUS_FIRST = 0,
    OLDSUBSCRIBESTATUS_RESUB = 1,
    OLDSUBSCRIBESTATUS_SUBINGRACEPERIOD = 2,
    OLDSUBSCRIBESTATUS_SUBNOTINGRACEPERIOD = 3,
    OLDSUBSCRIBESTATUS_DEFAULT = 100,
}

export enum SubscribingStatus {
    SUBSCRIBINGSTATUS_UNKNOWN = 0,
    SUBSCRIBINGSTATUS_ONCE = 1,
    SUBSCRIBINGSTATUS_CIRCLE = 2,
    SUBSCRIBINGSTATUS_CIRCLECANCEL = 3,
    SUBSCRIBINGSTATUS_REFUND = 4,
    SUBSCRIBINGSTATUS_INGRACEPERIOD = 5,
    SUBSCRIBINGSTATUS_NOTINGRACEPERIOD = 6,
}

export enum LinkmicStatus {
    Disable = 0,
    Enable = 1,
    Just_Following = 2,
    Multi_Linking = 3,
    Multi_Linking_Only_Following = 4,
}

export enum MemberMessageAction {
    UNKNOWN = 0,
    JOINED = 1,
    SUBSCRIBED = 3,
}

export enum ControlAction {
    ControlActionUNKNOWN = 0,
    STREAM_PAUSED = 1,
    STREAM_UNPAUSED = 2,
    STREAM_ENDED = 3,
}

export enum LinkLayerMessageType {
    Linker_Unknown = 0,
    Linker_Create = 1,
    Linker_Invite = 2,
    Linker_Apply = 3,
    Linker_Permit = 4,
    Linker_Reply = 5,
    Linker_Kick_Out = 6,
    Linker_Cancel_Apply = 7,
    Linker_Cancel_Invite = 8,
    Linker_Leave = 9,
    Linker_Finish = 10,
    Linker_List_Change = 11,
    Linker_Join_Direct = 12,
    Linker_Join_Group = 13,
    Linker_Permit_Group = 14,
    Linker_Cancel_Group = 15,
    Linker_Leave_Group = 16,
    Linker_P2P_Group_Change = 17,
    Linker_Group_Change = 18,
}

export enum BarrageType {
    BarrageType_Unknown = 0,
    EComOrdering = 1,
    EComBuying = 2,
    Normal = 3,
    Subscribe = 4,
    EventView = 5,
    EventRegistered = 6,
    SubscribeGift = 7,
    UserUpgrade = 8,
    GradeUserEntranceNotification = 9,
    FansLevelUpgrade = 10,
    FansLevelEntrance = 11,
    GamePartnership = 12,
}

export enum EnvelopeBusinessType {
    BusinessTypeUnknown = 0,
    BusinessTypeUserDiamond = 1,
    BusinessTypePlatformDiamond = 2,
    BusinessTypePlatformShell = 3,
    BusinessTypePortal = 4,
    BusinessTypePlatformMerch = 5,
    BusinessTypeEoYDiamond = 6,
    BusinessTypeFanClubGtM = 7,
}

export enum EnvelopeFollowShowStatus {
    EnvelopeFollowShowUnknown = 0,
    EnvelopeFollowShow = 1,
    EnvelopeFollowNotShow = 2,
}

export enum EnvelopeDisplay {
    EnvelopeDisplayUnknown = 0,
    EnvelopeDisplayNew = 1,
    EnvelopeDisplayHide = 2,
}

export enum CommonContentCase {
    COMMON_CONTENT_NOT_SET = 0,
    CREATE_CHANNEL_CONTENT = 100,
    LIST_CHANGE_CONTENT = 102,
    INVITE_CONTENT = 103,
    APPLY_CONTENT = 104,
    PERMIT_APPLY_CONTENT = 105,
    REPLY_INVITE_CONTENT = 106,
    KICK_OUT_CONTENT = 107,
    CANCEL_APPLY_CONTENT = 108,
    CANCEL_INVITE_CONTENT = 109,
    LEAVE_CONTENT = 110,
    FINISH_CONTENT = 111,
    JOIN_DIRECT_CONTENT = 112,
    JOIN_GROUP_CONTENT = 113,
    PERMIT_GROUP_CONTENT = 114,
    CANCEL_GROUP_CONTENT = 115,
    LEAVE_GROUP_CONTENT = 116,
    P2P_GROUP_CHANGE_CONTENT = 117,
    GROUP_CHANGE_CONTENT = 118,
}

export enum LinkMessageType {
    TPYE_LINKER_UNKNOWN = 0,
    TYPE_LINKER_CREATE = 1,
    TYPE_LINKER_CLOSE = 2,
    TYPE_LINKER_INVITE = 3,
    TYPE_LINKER_APPLY = 4,
    TYPE_LINKER_REPLY = 5,
    TPYE_LINKER_ENTER = 6,
    TPYE_LINKER_LEAVE = 7,
    TYPE_LINKER_PERMIT = 8,
    TPYE_LINKER_CANCEL_INVITE = 9,
    TYPE_LINKER_WAITING_LIST_CHANGE = 10,
    TYPE_LINKER_LINKED_LIST_CHANGE = 11,
    TYPE_LINKER_UPDATE_USER = 12,
    TPYE_LINKER_KICK_OUT = 13,
    TPYE_LINKER_CANCEL_APPLY = 14,
    TYPE_LINKER_MUTE = 15,
    TYPE_LINKER_MATCH = 16,
    TYPE_LINKER_UPDATE_USER_SETTING = 17,
    TYPE_LINKER_MIC_IDX_UPDATE = 18,
    TYPE_LINKER_LEAVE_V2 = 19,
    TYPE_LINKER_WAITING_LIST_CHANGE_V2 = 20,
    TYPE_LINKER_LINKED_LIST_CHANGE_V2 = 21,
    TYPE_LINKER_COHOST_LIST_CHANGE = 22,
    TYPE_LINKER_MEDIA_CHANGE = 23,
    TYPE_LINKER_ACCEPT_NOTICE = 24,
    TPYE_LINKER_SYS_KICK_OUT = 101,
    TPYE_LINKMIC_USER_TOAST = 102,
}

export enum MessageType {
    MESSAGETYPE_SUBSUCCESS = 0,
    MESSAGETYPE_ANCHORREMINDER = 1,
    MESSAGETYPE_ENTERROOMEXPIRESOON = 2,
    MESSAGETYPE_SUBGOALCREATETOANCHOR = 3,
    MESSAGETYPE_SUBGOALCOMPLETETOAUDIENCE = 4,
    MESSAGETYPE_SUBGOALCOMPLETETOANCHOR = 5,
    MESSAGETYPE_SUBGIFTTIKTOK2USERNOTICE = 6,
    MESSAGETYPE_SUBGIFTTIKTOK2ANCHORNOTICE = 7,
    MESSAGETYPE_SUBGIFTTRECEIVESENDNOTICE = 8,
    MESSAGETYPE_SUBGIFTSENDSUCCEEDROOMMESSAGE = 9,
    MESSAGETYPE_SUBGIFTSENDSUCCEEDANCHORNOTICE = 10,
    MESSAGETYPE_SUBGIFTLOWVERSIONUPGRADENOTICE = 11,
    MESSAGETYPE_SUBGIFTUSERBUYAUTHNOTICE = 12,
}

export enum Scene {
    UNKNOWN = 0,
    CO_HOST = 2,
    MULTI_LIVE = 4,
}

export enum CommonImDispatchStrategy {
    IM_DISPATCH_STRATEGY_DEFAULT = 0,
    IM_DISPATCH_STRATEGY_BYPASS_DISPATCH_QUEUE = 1,
}

export enum BadgeStructDataCase {
    DATA_NOT_SET = 0,
    IMAGE = 20,
    TEXT = 21,
    STR = 22,
    COMBINE = 23,
}

export enum BadgeStructBadgeDisplayType {
    BADGEDISPLAYTYPE_UNKNOWN = 0,
    BADGEDISPLAYTYPE_IMAGE = 1,
    BADGEDISPLAYTYPE_TEXT = 2,
    BADGEDISPLAYTYPE_STRING = 3,
    BADGEDISPLAYTYPE_COMBINE = 4,
}

export enum BadgeStructPosition {
    POSITIONUNKNOWN = 0,
    POSITIONLEFT = 1,
    POSITIONRIGHT = 2,
}

export enum UserLiveEventInfoEventPayMethod {
    EVENTPAYMETHODINVALID = 0,
    EVENTPAYMETHODCOINS = 1,
    EVENTPAYMETHODCASH = 2,
}

export enum UserEcommerceEntranceCreatorType {
    UNDEFINED = 0,
    OFFICIAL = 1,
    MARKET = 2,
    NORMAL = 3,
}

export enum UserEcommerceEntranceEntranceType {
    PROFILE = 0,
    SHOWCASE = 1,
    SHOP = 2,
}

export enum UserEcommerceEntranceShopEntranceInfoStoreLabelStoreBrandLabelType {
    NONE = 0,
    OFFICIAL = 1,
    AUTHORIZED = 2,
    STORE_BRAND_LABEL_TYPE_BLUE_V = 3,
    STORE_BRAND_LABEL_TYPE_TOP_CHOICE = 4,
}

export enum UserFansClubPreferntialType {
    PRESONALPROFILE = 0,
    OTHERROOM = 1,
}

export enum UserFansClubFansClubDataBadgeIcon {
    UNKNOWN = 0,
    ICON = 1,
    SMALLICON = 2,
}

export enum UserFansClubFansClubDataUserFansClubStatus {
    NOTJOINED = 0,
    ACTIVE = 1,
    INACTIVE = 2,
}

export enum ListUserLinkType {
    LINK_UNKNOWN = 0,
    AUDIO = 1,
    VIDEO = 2,
}

export enum WebcastBarrageMessageBarrageType {
    UNKNOWN = 0,
    ECOMORDERING = 1,
    ECOMBUYING = 2,
    NORMAL = 3,
    SUBSCRIBE = 4,
    EVENTVIEW = 5,
    EVENTREGISTERED = 6,
    SUBSCRIBEGIFT = 7,
    USERUPGRADE = 8,
    GRADEUSERENTRANCENOTIFICATION = 9,
    FANSLEVELUPGRADE = 10,
    FANSLEVELENTRANCE = 11,
    GAMEPARTNERSHIP = 12,
}


export interface Common  {
    method: string
    msgId: number
    roomId: number
    createTime: number
    monitor: number
    isShowMsg: boolean
    describe: string
    displayText: Text
    foldType: number
    anchorFoldType: number
    priorityScore: number
    logId: string
    msgProcessFilterK: string
    msgProcessFilterV: string
    fromIdc: string
    toIdc: string
    filterMsgTagsList: string[]
    sei: CommonLiveMessageSei
    dependRootId: CommonLiveMessageId
    dependId: CommonLiveMessageId
    anchor_priority_score: number
    room_message_heat_level: number
    fold_type_for_web: number
    anchor_fold_type_for_web: number
    client_send_time: number
    dispatch_strategy: CommonImDispatchStrategy
}

export interface CommonLiveMessageSei  {
    unique_id: CommonLiveMessageId
    timestamp: number
}

export interface CommonLiveMessageId  {
    primary_id: string
    message_scene: string
}

export interface Text  {
    key: string
    default_pattern: string
    default_format: TextTextFormat
    pieces_list: TextTextPiece[]
}

export interface TextTextPiece  {
    type: number
    format: TextTextFormat
    string_value: string
    user_value: TextTextPieceUser
    gift_value: TextTextPieceGift
    pattern_ref_value: TextTextPiecePatternRef
}

export interface TextTextFormat  {
    color: string
    bold: boolean
    italic: boolean
    weight: number
    italic_angle: number
    font_size: number
    use_heigh_light_color: boolean
    use_remote_clor: boolean
}

export interface TextTextPieceGift  {
    gift_id: number
    color_id: number
}

export interface TextTextPiecePatternRef  {
    key: string
    default_pattern: string
}

export interface TextTextPieceUser  {
    user: User
    with_colon: boolean
}

export interface Image  {
    urlList: string[]
    isAnimated: boolean
}

export interface BadgeStruct  {
    displayType: BadgeStructBadgeDisplayType
    image: BadgeStructImageBadge
    text: BadgeStructTextBadge
    str: BadgeStructStringBadge
    combine: BadgeStructCombineBadge
}

export interface BadgeStructCombineBadge  {
    icon: Image
    text: BadgeStructTextBadge
    str: string
    profileCardPanel: BadgeStructProfileCardPanel
    background: BadgeStructCombineBadgeBackground
    backgroundDarkMode: BadgeStructCombineBadgeBackground
    icon_auto_mirrored: boolean
    background_auto_mirrored: boolean
    public_screen_show_style: number
    personal_card_show_style: number
    ranklist_online_audience_show_style: number
    multi_guest_show_style: number
}

export interface BadgeStructProfileContent  {
    use_content: boolean
    icon_list: BadgeStructIconConfig[]
    number_config: BadgeStructNumberConfig
}

export interface BadgeStructProjectionConfig  {
    use_projection: boolean
    icon: Image
}

export interface BadgeStructNumberConfig  {
    number: number
    background: BadgeStructCombineBadgeBackground
}

export interface BadgeStructProfileCardPanel  {
    use_new_profile_card_style: boolean
    projection_config: BadgeStructProjectionConfig
    profile_content: BadgeStructProfileContent
}

export interface BadgeStructCombineBadgeBackground  {
    image: Image
    backgroundColorCode: string
    borderColorCode: string
}

export interface BadgeStructImageBadge  {
    image: Image
}

export interface BadgeStructTextBadge  {
    default_pattern: string
}

export interface BadgeStructIconConfig  {
    icon: Image
    background: BadgeStructCombineBadgeBackground
}

export interface BadgeStructStringBadge  {
    str: string
}

export interface GiftStruct  {
    image: Image
    describe: string
    duration: number
    id: number
    forLinkmic: boolean
    combo: boolean
    type: number
    diamondCount: number
    isDisplayedOnPanel: boolean
    primaryEffectId: number
    giftLabelIcon: Image
    name: string
    icon: Image
    goldEffect: string
    previewImage: Image
    gift_panel_banner: GiftStructGiftPanelBanner
    isBroadcastGift: boolean
    is_effect_befview: boolean
    isRandomGift: boolean
    isBoxGift: boolean
    canPutInGiftBox: boolean
}

export interface GiftStructGiftPanelBanner  {
    display_text: Text
    left_icon: Image
    schema_url: string
    bg_color_values_list: string[]
    banner_lynx_url: string
}

export interface GiftStructGiftRandomEffectInfo  {
    random_gift_panel_banner: GiftStructRandomGiftPanelBanner
    effect_ids_list: number[]
    host_key: string
    audience_key: string
    random_gift_bubble: GiftStructRandomGiftBubble
}

export interface GiftStructRandomGiftBubble  {
    display_text: string
    icon_dynamic_effect: Image
}

export interface GiftStructRandomGiftPanelBanner  {
    bg_image: Image
    shading_image: Image
    target_num: number
    collect_num: number
    display_text: string
    left_icon: Image
    schema_url: string
    bg_color_values_list: string[]
    round: number
}

export interface User  {
    id: number
    nickname: string
    bioDescription: string
    avatarThumb: Image
    avatarMedium: Image
    avatarLarger: Image
    verified: boolean
    status: number
    create_time: number
    modify_time: number
    secret: number
    share_qrcode_uri: string
    badgeImageList: Image[]
    follow_info: UserFollowInfo
    pay_grade: UserPayGrade
    fans_club: UserFansClub
    border: UserBorder
    special_id: string
    avatar_border: Image
    medal: Image
    real_time_icons_list: Image[]
    new_real_time_icons_list: Image[]
    top_vip_no: number
    user_attr: UserUserAttr
    own_room: UserOwnRoom
    pay_score: number
    ticket_count: number
    link_mic_stats: LinkmicStatus
    displayId: string
    with_commerce_permission: boolean
    with_fusion_shop_entry: boolean
    webcast_anchor_level: UserAnchorLevel
    verified_content: string
    author_stats: UserAuthorStats
    top_fans_list: User[]
    sec_uid: string
    user_role: number
    activity_reward: UserActivityInfo
    personal_card: Image
    authentication_info: UserAuthenticationInfo
    media_badge_image_list: Image[]
    commerce_webcast_config_ids_list: number[]
    border_list: UserBorder[]
    combo_badge_info: UserComboBadgeInfo
    subscribe_info: UserSubscribeInfo
    badgeList: undefined|BadgeStruct[]
    mint_type_label_list: number[]
    fans_club_info: UserFansClubInfo
    allow_find_by_contacts: boolean
    allow_others_download_video: boolean
    allow_others_download_when_sharing_video: boolean
    allow_share_show_profile: boolean
    allow_show_in_gossip: boolean
    allow_show_my_action: boolean
    allow_strange_comment: boolean
    allow_unfollower_comment: boolean
    allow_use_linkmic: boolean
    anchor_level: UserAnchorLevel
    avatar_jpg: Image
    bg_img_url: string
    block_status: number
    comment_restrict: number
    constellation: string
    disable_ichat: number
    enable_ichat_img: number
    exp: number
    fan_ticket_count: number
    fold_stranger_chat: boolean
    follow_status: number
    ichat_restrict_type: number
    id_str: string
    is_follower: boolean
    is_following: boolean
    need_profile_guide: boolean
    pay_scores: number
    push_comment_status: boolean
    push_digg: boolean
    push_follow: boolean
    push_friend_action: boolean
    push_ichat: boolean
    push_status: boolean
    push_video_post: boolean
    push_video_recommend: boolean
    stats: UserUserStats
    verified_reason: string
    with_car_management_permission: boolean
    upcoming_event_list: UserLiveEventInfo[]
    scm_label: string
    ecommerce_entrance: UserEcommerceEntrance
    is_block: boolean
}

export interface UserLiveEventInfo  {
    event_id: number
    start_time: number
    duration: number
    title: string
    description: string
    has_subscribed: boolean
    is_paid_event: boolean
    ticket_amount: number
    pay_method: number
}

export interface UserLiveEventInfoWalletPackage  {
    iap_id: string
    usd_price_show: string
}

export interface UserActivityInfo  {
    badge: Image
    storytag: Image
}

export interface UserAnchorLevel  {
    level: number
    experience: number
    lowest_experience_this_level: number
    highest_experience_this_level: number
    task_start_experience: number
    task_start_time: number
    task_decrease_experience: number
    task_target_experience: number
    task_end_time: number
    profile_dialog_bg: Image
    profile_dialog_bg_back: Image
    stage_level: Image
    small_icon: Image
}

export interface UserAuthenticationInfo  {
    custom_verify: string
    enterprise_verify_reason: string
    authentication_badge: Image
}

export interface UserAuthorStats  {
    video_total_count: number
    video_total_play_count: number
    video_total_share_count: number
    video_total_series_count: number
    variety_show_play_count: number
    video_total_favorite_count: number
}

export interface UserBorder  {
    icon: Image
    level: number
    source: string
    profile_decoration_ribbon: Image
    avatar_background_color: string
    avatar_background_border_color: string
}

export interface UserComboBadgeInfo  {
    icon: Image
    combo_count: number
}

export interface UserEcommerceEntrance  {
    entrance_type: UserEcommerceEntranceEntranceType
    creator_type: UserEcommerceEntranceCreatorType
    schema: string
    shop_entrance_info: UserEcommerceEntranceShopEntranceInfo
    showcase_entrance_info: UserEcommerceEntranceShowcaseEntranceInfo
}

export interface UserEcommerceEntranceShopEntranceInfo  {
    shop_id: string
    shop_name: string
    shop_rating: string
    store_label: UserEcommerceEntranceShopEntranceInfoStoreLabel
    format_sold_count: string
    sold_count: number
    exp_rate_percentile: number
    exp_rate_top_display: string
    rate_display_style: number
    show_rate_not_applicable: boolean
}

export interface UserEcommerceEntranceShopEntranceInfoStoreLabel  {
    official_label: UserEcommerceEntranceShopEntranceInfoStoreLabelStoreOfficialLabel
    is_bytemall: boolean
}

export interface UserEcommerceEntranceShopEntranceInfoStoreLabelStoreOfficialLabel  {
    label_image_light: UserEcommerceEntranceShopEntranceInfoStoreLabelStoreOfficialLabelShopLabelImage
    label_image_dark: UserEcommerceEntranceShopEntranceInfoStoreLabelStoreOfficialLabelShopLabelImage
    label_type: number
    label_type_str: string
}

export interface UserEcommerceEntranceShopEntranceInfoStoreLabelStoreOfficialLabelShopLabelImage  {
    height: number
    width: number
    minetype: string
    thumb_uri: string
    thumb_uri_list: string[]
    uri: string
    url_list: string[]
    color: string
}

export interface UserEcommerceEntranceShowcaseEntranceInfo  {
    format_sold_count: string
    sold_count: number
}

export interface UserFansClub  {
    data: UserFansClubFansClubData
}

export interface UserFansClubFansClubData  {
    club_name: string
    level: number
    user_fans_club_status: UserFansClubFansClubDataUserFansClubStatus
    available_gift_ids_list: number[]
    anchor_id: number
}

export interface UserFansClubInfo  {
    is_sleeping: boolean
    fans_level: number
    fans_score: number
    badge: Image
    fans_count: number
}

export interface UserFollowInfo  {
    following_count: number
    follower_count: number
    follow_status: number
    push_status: number
}

export interface UserOwnRoom  {
    room_ids_list: number[]
    room_ids_str_list: string[]
}

export interface UserPayGrade  {
    diamond_icon: Image
    name: string
    icon: Image
    next_name: string
    level: number
    next_icon: Image
    grade_describe: string
    grade_icon_list: UserPayGradeGradeIcon[]
    screen_chat_type: number
    im_icon: Image
    im_icon_with_level: Image
    live_icon: Image
    new_im_icon_with_level: Image
    new_live_icon: Image
    upgrade_need_consume: number
    next_privileges: string
    background: Image
    background_back: Image
    score: number
    grade_banner: string
    profile_dialog_bg: Image
    profile_dialog_bg_back: Image
}

export interface UserPayGradeGradeIcon  {
    icon: Image
    icon_diamond: number
    level: number
    level_str: string
}

export interface UserSubscribeBadge  {
    origin_img: Image
    preview_img: Image
}

export interface UserSubscribeInfo  {
    qualification: boolean
    is_subscribe: boolean
    badge: UserSubscribeBadge
    enable_subscription: boolean
    subscriber_count: number
    is_in_grace_period: boolean
    is_subscribed_to_anchor: boolean
    user_gift_sub_auth: boolean
    anchor_gift_sub_auth: boolean
}

export interface UserUserAttr  {
    is_muted: boolean
    is_admin: boolean
    is_super_admin: boolean
    mute_duration: number
}

export interface UserUserStats  {
    id: number
    id_str: string
    following_count: number
    follower_count: number
    record_count: number
    total_duration: number
    daily_fan_ticket_count: number
    daily_income: number
    item_count: number
    favorite_item_count: number
    diamond_consumed_count: number
    tuwen_item_count: number
}

export interface Emote  {
    emoteId: string
    image: Image
    audit_status: AuditStatus
    uuid: string
    emoteType: EmoteType
    content_source: ContentSource
    emote_private_type: EmotePrivateType
}

export interface PunishEventInfo  {
    punish_type: string
    punish_reason: string
    punish_id: string
    violation_uid: number
    punish_type_id: number
    duration: number
}

export interface MsgFilter  {
    is_gifter: boolean
    is_subscribed_to_anchor: boolean
}

export interface UserIdentity  {
    is_gift_giver_of_anchor: boolean
    is_subscriber_of_anchor: boolean
    is_mutual_following_with_anchor: boolean
    is_follower_of_anchor: boolean
    is_moderator_of_anchor: boolean
    is_anchor: boolean
}

export interface Goal  {
    id: number
    description: string
    audit_status: number
    start_time: number
    expire_time: number
    real_finish_time: number
    contributors_list: GoalGoalContributor[]
    contributors_length: number
    id_str: string
    audit_description: string
    stats: GoalGoalStats
}

export interface GoalGoalStats  {
    total_coins: number
    total_contributor: number
}

export interface GoalGoalContributor  {
    user_id: number
    avatar: Image
    display_id: string
    score: number
    user_id_str: string
    in_room: boolean
    is_friend: boolean
    badge_list: BadgeStruct[]
    follow_by_owner: boolean
    is_fist_contribute: boolean
}

export interface Indicator  {
    key: string
    op: number
}

export interface Ranking  {
    type: string
    label: string
    color: TikTokColor
    details: ValueLabel[]
}

export interface TikTokColor  {
    color: string
    id: number
    data1: number
}

export interface ValueLabel  {
    data: number
    label: string
    label2: string
    label3: string
}

export interface MessageDetails  {
    data1: number
    color: TikTokColor
    category: string
    user: UserContainer
}

export interface UserContainer  {
    user: User
    data1: number
}

export interface DataContainer  {
    data1: number
    data2: number
    data3: number
    data4: number
    data5: number
    data6: number
    data7: number
    data8: number
    data9: number
}

export interface TimeStampContainer  {
    timestamp1: number
    timestamp2: number
    timestamp3: number
}

export interface MemberMessageData  {
    type: string
    label: string
    color: TikTokColor
    details: MessageDetails[]
}

export interface LinkMicArmiesItems  {
    host_user_id: number
    battle_groups: LinkMicArmiesItemsLinkMicArmiesGroup[]
}

export interface LinkMicArmiesItemsLinkMicArmiesGroup  {
    users: User[]
    points: number
}

export interface PollStartContent  {
    start_time: number
    end_time: number
    option_list: PollOptionInfo[]
    title: string
    operator: User
}

export interface PollEndContent  {
    end_type: number
    option_list: PollOptionInfo[]
    operator: User
}

export interface PollOptionInfo  {
    votes: number
    display_content: string
    option_idx: number
    vote_user_list: VoteUser[]
}

export interface VoteUser  {
    user_id: number
    nick_name: string
    avatar_thumb: Image
}

export interface PollUpdateVotesContent  {
    option_list: PollOptionInfo[]
}

export interface UserFanTicket  {
    user_id: number
    fan_ticket: number
    match_total_score: number
    match_rank: number
}

export interface FanTicketRoomNoticeContent  {
    user_fan_ticket_list: UserFanTicket[]
    total_link_mic_fan_ticket: number
    match_id: number
    event_time: number
    fan_ticket_icon_url: string
}

export interface LinkerAcceptNoticeContent  {
    from_user_id: number
    from_room_id: number
    to_user_id: number
}

export interface LinkerCancelContent  {
    from_user_id: number
    to_user_id: number
    cancel_type: number
    action_id: number
}

export interface ListUser  {
    user: User
    linkmic_id: number
    linkmic_id_str: string
    link_status: number
    link_type: ListUserLinkType
    user_position: number
    silence_status: number
    modify_time: number
    linker_id: number
    role_type: number
}

export interface LinkerCloseContent  {
}

export interface LinkerCreateContent  {
    owner_id: number
    owner_room_id: number
    link_type: number
}

export interface LinkerEnterContent  {
    linked_users_list: ListUser[]
    anchor_multi_live_enum: number
    anchor_setting_info: LinkmicUserSettingInfo
}

export interface LinkerInviteContent  {
    from_user_id: number
    from_room_id: number
    to_rtc_ext_info: string
    rtc_join_channel: boolean
    vendor: number
    sec_from_user_id: string
    to_linkmic_id_str: string
    from_user: User
    required_mic_idx: number
}

export interface LinkerKickOutContent  {
    from_user_id: number
    kickout_reason: KickoutReason
}

export interface LinkerLeaveContent  {
    user_id: number
    linkmic_id_str: string
    send_leave_uid: number
    leave_reason: number
}

export interface LinkerLinkedListChangeContent  {
}

export interface CohostListChangeContent  {
}

export interface LinkerListChangeContent  {
    linked_users_list: ListUser[]
    applied_users_list: ListUser[]
    connecting_users_list: ListUser[]
}

export interface LinkerMediaChangeContent  {
    op: number
    to_user_id: number
    anchor_id: number
    room_id: number
    change_scene: number
}

export interface LinkerMicIdxUpdateContent  {
}

export interface LinkerMuteContent  {
    user_id: number
    status: number
}

export interface LinkerRandomMatchContent  {
    user: User
    room_id: number
    invite_type: number
    match_id: string
    inner_channel_id: number
}

export interface LinkerReplyContent  {
    from_user_id: number
    from_room_id: number
    from_user_linkmic_info: LinkerReplyContentLinkmicInfo
    to_user_id: number
    to_user_linkmic_info: LinkerReplyContentLinkmicInfo
    link_type: number
    reply_status: number
    linker_setting: LinkerSetting
    from_user: User
    to_user: User
}

export interface LinkerReplyContentLinkmicInfo  {
    access_key: string
    link_mic_id: number
    joinable: boolean
    confluence_type: number
    rtc_ext_info: string
    rtc_app_id: string
    rtc_app_sign: string
    linkmic_id_str: string
    vendor: number
}

export interface LinkerSetting  {
    max_member_limit: number
    link_type: number
    scene: number
    owner_user_id: number
    owner_room_id: number
    vendor: number
}

export interface LinkerSysKickOutContent  {
    user_id: number
    linkmic_id_str: string
}

export interface LinkmicUserToastContent  {
    user_id: number
    room_id: number
    display_text: Text
}

export interface LinkerUpdateUserContent  {
    from_user_id: number
    to_user_id: number
}

export interface LinkerUpdateUserSettingContent  {
}

export interface LinkerWaitingListChangeContent  {
}

export interface LinkmicUserSettingInfo  {
    user_id: number
    layout: number
    fix_mic_num: number
    allow_request_from_user: number
    allow_request_from_follower_only: number
    applier_sort_setting: LinkmicApplierSortSetting
}

export interface Player  {
    room_id: number
    user_id: number
}

export interface AllListUser  {
    linked_list: LinkLayerListUser[]
    applied_list: LinkLayerListUser[]
    invited_list: LinkLayerListUser[]
    ready_list: LinkLayerListUser[]
}

export interface LinkLayerListUser  {
    user: User
    linkmic_id: number
    pos: Position
    linked_time_nano: number
    app_version: string
    magic_number1: number
}

export interface Position  {
    type: number
    link: LinkPosition
}

export interface LinkPosition  {
    position: number
    opt: number
}

export interface GroupPlayer  {
    channel_id: number
    user: User
}

export interface DslConfig  {
    scene_version: number
    layout_id: string
}

export interface GroupChannelAllUser  {
    group_channel_id: number
    user_list: GroupChannelUser[]
}

export interface GroupChannelUser  {
    channel_id: number
    status: GroupStatus
    type: TextType
    all_user: AllListUser
    join_time: number
    linked_time: number
    owner_user: GroupPlayer
}

export interface RtcExtraInfo  {
    live_rtc_engine_config: RtcExtraInfoRtcEngineConfig
    live_rtc_video_param_list: RtcExtraInfoRtcLiveVideoParam[]
    rtc_bitrate_map: RtcExtraInfoRtcBitrateMap
    rtc_fps: number
    rtc_business_id: string
    interact_client_type: number
}

export interface RtcExtraInfoRtcEngineConfig  {
    rtc_app_id: string
    rtc_user_id: string
    rtc_token: string
    rtc_channel_id: number
}

export interface RtcExtraInfoRtcLiveVideoParam  {
    strategy_id: number
    params: RtcExtraInfoRtcVideoParam
}

export interface RtcExtraInfoRtcVideoParam  {
    width: number
    height: number
    fps: number
    bitrate_kbps: number
}

export interface RtcExtraInfoRtcBitrateMap  {
    xx1: number
    xx2: number
    xx3: number
    xx4: number
}

export interface CreateChannelContent  {
    owner: Player
    owner_link_mic_id: string
}

export interface ListChangeContent  {
    type: TextType
    list: AllListUser
}

export interface MultiLiveContent  {
    invite_biz_content: MultiLiveContentInviteBizContent
    reply_biz_content: MultiLiveContentReplyBizContent
    permit_biz_content: MultiLiveContentPermitBizContent
    kick_out_biz_content: MultiLiveContentKickOutBizContent
}

export interface MultiLiveContentInviteBizContent  {
    anchor_setting_info: LinkmicUserSettingInfo
    invite_source: number
    operator_user_info: User
    operator_link_admin_type: number
    invitee_user_info: User
}

export interface MultiLiveContentReplyBizContent  {
    link_type: number
    is_turn_off_invitation: number
    reply_user_info: User
}

export interface MultiLiveContentPermitBizContent  {
    anchor_setting_info: LinkmicUserSettingInfo
    expire_timestamp: number
    operator_user_info: User
    operator_link_admin_type: number
}

export interface MultiLiveContentKickOutBizContent  {
    operator_user_info: User
    operator_link_admin_type: number
    kick_player_user_info: User
}

export interface InviteContent  {
    invitor: Player
    invitee_rtc_ext_info: RtcExtraInfo
    invitor_link_mic_id: string
    invitee_link_mic_id: string
    is_owner: boolean
    pos: Position
    dsl: DslConfig
    invitee: User
    operator: User
}

export interface ApplyContent  {
    applier: Player
    applier_link_mic_id: string
}

export interface PermitApplyContent  {
    permiter: Player
    permiter_link_mic_id: string
    applier_pos: Position
    reply_status: ReplyStatus
    dsl: DslConfig
    applier: User
    operator: User
    applier_link_mic_id: string
}

export interface ReplyInviteContent  {
    invitee: Player
    reply_status: ReplyStatus
    invitee_link_mic_id: string
    invitee_pos: Position
    invite_operator_user: Player
}

export interface KickOutContent  {
    offliner: Player
    kickout_reason: KickoutReason
}

export interface CancelApplyContent  {
    applier: Player
    applier_link_mic_id: string
}

export interface CancelInviteContent  {
    invitor: Player
    invitor_link_mic_id: string
    invitee_link_mic_id: string
    invite_seq_id: number
    invitee: Player
}

export interface LeaveContent  {
    leaver: Player
    leave_reason: number
}

export interface FinishChannelContent  {
    owner: Player
    finish_reason: number
}

export interface JoinDirectContent  {
    joiner: LinkLayerListUser
    all_users: AllListUser
}

export interface LeaveJoinGroupContent  {
    operator: GroupPlayer
    group_channel_id: number
    leave_source: string
}

export interface PermitJoinGroupContent  {
    approver: GroupPlayer
    agree_status: AgreeStatus
    type: TextType
    group_ext_info_list: RtcExtraInfo[]
    group_user: GroupChannelAllUser
}

export interface CancelJoinGroupContent  {
    leaver_list: GroupPlayer[]
    operator: GroupPlayer
    type: TextType
}

export interface P2PGroupChangeContent  {
    group_ext_info_list: RtcExtraInfo[]
    group_user: GroupChannelAllUser
}

export interface BusinessContent  {
    over_length: number
    multi_live_content: MultiLiveContent
    cohost_content: BusinessContentCohostContent
}

export interface BusinessContentCohostContent  {
    join_group_biz_content: BusinessContentJoinGroupBizContent
}

export interface BusinessContentJoinGroupBizContent  {
    from_room_age_restricted: number
    from_tag: BusinessContentTag
    dialog: BusinessContentPerceptionDialogInfo
    punish_info: PunishEventInfo
    join_group_msg_extra: BusinessContentJoinGroupMessageExtra
}

export interface BusinessContentTag  {
    tag_type: number
    tag_value: string
    tag_text: string
}

export interface BusinessContentPerceptionDialogInfo  {
    icon_type: number
    title: Text
    sub_title: Text
    advice_action_text: Text
    default_action_text: Text
    violation_detail_url: string
    scene: number
    target_user_id: number
    target_room_id: number
    count_down_time: number
    show_feedback: boolean
    feedback_options_list: BusinessContentPerceptionFeedbackOption[]
    policy_tip: number
}

export interface BusinessContentPerceptionFeedbackOption  {
    id: number
    content_key: string
}

export interface BusinessContentJoinGroupMessageExtra  {
    source_type: number
    extra: BusinessContentJoinGroupMessageExtraRivalExtra
    other_users_list: BusinessContentJoinGroupMessageExtraRivalExtra[]
}

export interface BusinessContentJoinGroupMessageExtraRivalExtra  {
    user_count: number
    avatar_thumb: Image
    display_id: string
    authentication_info: BusinessContentJoinGroupMessageExtraRivalExtraAuthenticationInfo
    nickname: string
    follow_status: number
    hashtag: BusinessContentHashtag
    top_host_info: BusinessContentTopHostInfo
    user_id: number
    is_best_teammate: boolean
}

export interface BusinessContentJoinGroupMessageExtraRivalExtraAuthenticationInfo  {
    custom_verify: string
    enterprise_verify_reason: string
    authentication_badge: Image
}

export interface BusinessContentHashtag  {
    id: number
    title: string
    image: Image
    namespace: HashtagNamespace
}

export interface BusinessContentTopHostInfo  {
    rank_type: string
    top_index: number
}

export interface JoinGroupContent  {
    group_user: GroupChannelAllUser
    join_user: GroupPlayer
    type: TextType
}

export interface WebcastPushFrame  {
    seq_id: number
    log_id: number
    service: number
    method: number
    headers: string[]
    payload_encoding: string
    payload_type: string
    payload: unknown
}

export interface WebcastResponse  {
    messages: WebcastResponseMessage[]
    cursor: string
    fetch_interval: number
    now: number
    internal_ext: string
    fetch_type: number
    route_params_map: string[]
    heart_beat_duration: number
    needs_ack: boolean
    push_server: string
    is_first: boolean
    history_comment_cursor: string
    history_no_more: boolean
}

export interface WebcastResponseMessage  {
    method: string
    payload: unknown
    msg_id: number
    msg_type: number
    offset: number
    is_history: boolean
}

export interface WebcastGiftMessage  {
    common: Common
    giftId: number
    fan_ticket_count: number
    groupCount: number
    repeatCount: number
    comboCount: number
    user: User
    toUser: User
    repeatEnd: number
    groupId: number
    income_taskgifts: number
    room_fan_ticket_count: number
    gift: GiftStruct
    log_id: string
    sendType: number
    monitor_extra: string
    colorId: number
    isFirstSent: boolean
    order_id: string
    userIdentity: UserIdentity
    userGiftReceiver: WebcastGiftMessageUserGiftReciever
}

export interface WebcastGiftMessageUserGiftReciever  {
    user_id: number
    device_name: string
}

export interface WebcastGiftMessageGiftImPriority  {
    queue_sizes_list: number[]
    self_queue_priority: number
    priority: number
}

export interface WebcastGiftMessagePublicAreaCommon  {
    user_label: Image
    user_consume_in_room: number
}

export interface RoomMessage  {
    common: Common
    content: string
    supprot_landscape: boolean
    source: number
    icon: Image
    scene: string
    is_welcome: boolean
}

export interface WebcastRoomMessage  {
    common: Common
    content: string
}

export interface WebcastBarrageMessage  {
    common: Common
    event: WebcastBarrageMessageBarrageEvent
    msg_type: WebcastBarrageMessageBarrageType
    icon: Image
    content: Text
    duration: number
    background: Image
    right_icon: Image
    user_grade_param: WebcastBarrageMessageBarrageTypeUserGradeParam
    fans_level_param: WebcastBarrageMessageBarrageTypeFansLevelParam
    subscribe_gift_param: WebcastBarrageMessageBarrageTypeSubscribeGiftParam
}

export interface WebcastBarrageMessageBarrageTypeUserGradeParam  {
    current_grade: number
    display_config: number
    user_id: string
    user: User
}

export interface WebcastBarrageMessageBarrageTypeFansLevelParam  {
    current_grade: number
    display_config: number
    user: User
}

export interface WebcastBarrageMessageBarrageTypeSubscribeGiftParam  {
    gift_sub_count: number
    show_gift_sub_count: boolean
}

export interface WebcastBarrageMessageBarrageEvent  {
    event_name: string
}

export interface WebcastCaptionMessage  {
    common: Common
    time_stamp: number
    caption_data: WebcastCaptionMessageCaptionData
}

export interface WebcastCaptionMessageCaptionData  {
    language: string
    text: string
}

export interface WebcastChatMessage  {
    common: Common
    user: User
    content: string
    visible_to_sender: boolean
    background_image: Image
    full_screen_text_color: string
    background_image_v2: Image
    gift_image: Image
    input_type: number
    at_user: User
    emotesList: WebcastChatMessageEmoteWithIndex[]
    content_language: string
    quick_chat_scene: number
    community_flagged_status: number
    userIdentity: UserIdentity
    comment_quality_scores: string[]
}

export interface WebcastChatMessageEmoteWithIndex  {
    index: number
    emote: Emote
}

export interface WebcastControlMessage  {
    common: Common
    action: ControlAction
    tips: string
    extra: WebcastControlMessageExtra
    perception_audience_text: Text
    punish_info: PunishEventInfo
    float_text: Text
    float_style: number
}

export interface WebcastControlMessageExtra  {
    ban_info_url: string
    reason_no: number
    title: Text
    violation_reason: Text
    content: Text
    got_it_button: Text
    ban_detail_button: Text
    source: string
}

export interface WebcastEmoteChatMessage  {
    common: Common
    user: User
    emote_list: Emote[]
    msg_filter: MsgFilter
    user_identity: UserIdentity
}

export interface WebcastEnvelopeMessage  {
    common: Common
    envelope_info: WebcastEnvelopeMessageEnvelopeInfo
    display: EnvelopeDisplay
}

export interface WebcastEnvelopeMessageEnvelopeInfo  {
    envelope_id: string
    business_type: EnvelopeBusinessType
    envelope_idc: string
    send_user_name: string
    diamond_count: number
    people_count: number
    unpack_at: number
    send_user_id: string
    send_user_avatar: Image
    create_at: string
    room_id: string
    follow_show_status: EnvelopeFollowShowStatus
    skin_id: number
}

export interface WebcastGoalUpdateMessage  {
    common: Common
    indicator: Indicator
    goal: Goal
    contributor_id: number
    contributor_avatar: Image
    contributor_display_id: string
    contribute_count: number
    contribute_score: number
    gift_repeat_count: number
    contributor_id_str: string
    pin: boolean
    unpin: boolean
}

export interface WebcastImDeleteMessage  {
    common: Common
    delete_msg_ids_list: number[]
    delete_user_ids_list: number[]
}

export interface WebcastInRoomBannerMessage  {
    header: Common
    json: string
}

export interface WebcastLikeMessage  {
    common: Common
    count: number
    total: number
    user: User
}

export interface WebcastRoomUserSeqMessage  {
    common: Common
    ranks_list: WebcastRoomUserSeqMessageContributor[]
    total: number
    pop_str: string
    seats_list: WebcastRoomUserSeqMessageContributor[]
    popularity: number
    total_user: number
    anonymous: number
}

export interface WebcastRoomUserSeqMessageContributor  {
    score: number
    user: User
    rank: number
    delta: number
}

export interface WebcastSocialMessage  {
    common: Common
    user: User
    share_type: number
    action: number
    share_target: string
    follow_count: number
    share_display_style: number
    share_count: number
}

export interface WebcastSubNotifyMessage  {
    common: Common
    user: User
    subMonth: number
    subscribeType: SubscribeType
    oldSubscribeStatus: OldSubscribeStatus
    subscribingStatus: SubscribingStatus
    isSend: boolean
    isCustom: boolean
}

export interface WebcastRankUpdateMessage  {
    common: Common
    updates_list: WebcastRankUpdateMessageRankUpdate[]
    group_type: number
    priority: number
    tabs_list: WebcastRankUpdateMessageRankTabInfo[]
    is_animation_loop_play: boolean
    animation_loop_for_off: boolean
}

export interface WebcastRankUpdateMessageRankTabInfo  {
    rank_type: number
    title: string
    title_text: Text
    list_lynx_type: number
}

export interface WebcastRankUpdateMessageRankUpdate  {
    rank_type: number
    owner_rank: number
    default_content: Text
    show_entrance_animation: boolean
    countdown: number
    related_tab_rank_type: number
    request_first_show_type: number
    supported_version: number
    owneronrank: boolean
}

export interface WebcastMemberMessage  {
    common: Common
    user: User
    member_count: number
    operator: User
    is_set_to_admin: boolean
    is_top_user: boolean
    rank_score: number
    top_user_no: number
    enter_type: number
    action: MemberMessageAction
    action_description: string
    user_id: number
    effect_config: WebcastMemberMessageEffectConfig
    pop_str: string
    enter_effect_config: WebcastMemberMessageEffectConfig
    background_image: Image
    background_image_v2: Image
    anchor_display_text: Text
    client_enter_source: string
    client_enter_type: string
    client_live_reason: string
    action_duration: number
    user_share_type: string
}

export interface WebcastMemberMessageEffectConfig  {
    type: number
    icon: Image
    avatar_pos: number
    text: Text
    text_icon: Image
    stay_time: number
    anim_asset_id: number
    badge: Image
    flex_setting_array_list: number[]
}

export interface WebcastPollMessage  {
    common: Common
    message_type: MessageType
    poll_id: number
    start_content: PollStartContent
    end_content: PollEndContent
    update_content: PollUpdateVotesContent
    poll_kind: number
}

export interface WebcastQuestionNewMessage  {
    common: Common
    details: WebcastQuestionNewMessageQuestionDetails
}

export interface WebcastQuestionNewMessageQuestionDetails  {
    id: number
    text: string
    time_stamp: number
    user: User
    data1: number
}

export interface WebcastRankTextMessage  {
    common: Common
    scene: number
    owner_idx_before_update: number
    owner_idx_after_update: number
    self_get_badge_msg: Text
    other_get_badge_msg: Text
    cur_user_id: number
}

export interface WebcastHourlyRankMessage  {
    common: Common
    data: WebcastHourlyRankMessageRankContainer
    data2: number
}

export interface WebcastHourlyRankMessageRankContainer  {
    data1: number
    rankingdata: WebcastHourlyRankMessageRankContainerRankingData
    data2: number
    rankings: Ranking
    rankingdata2: WebcastHourlyRankMessageRankContainerRankingData2
    data3: number
    data4: number
}

export interface WebcastHourlyRankMessageRankContainerRankingData  {
    data1: number
    rankdata: Ranking
    data2: string
}

export interface WebcastHourlyRankMessageRankContainerRankingData2  {
    data1: number
    data2: number
    rankdata: Ranking
    data3: string
    data4: number
    data5: number
}

export interface WebcastLinkMicArmies  {
    common: Common
    id: number
    battle_items: LinkMicArmiesItems[]
    id2: number
    time_stamp1: number
    time_stamp2: number
    battle_status: number
    data1: number
    data2: number
    data3: number
    image: Image
    data4: number
    data5: number
}

export interface WebcastLinkMicBattlePunishFinish  {
    header: Common
    id1: number
    timestamp: number
    data4: number
    id2: number
    data6: WebcastLinkMicBattlePunishFinishLinkMicBattlePunishFinishData
}

export interface WebcastLinkMicBattlePunishFinishLinkMicBattlePunishFinishData  {
    id2: number
    timestamp: number
    data3: number
    id1: number
    data5: number
    data6: number
    data8: number
}

export interface WebcastLinkmicBattleTaskMessage  {
    header: Common
    data2: number
    data3: WebcastLinkmicBattleTaskMessageLinkmicBattleTaskData
    data5: WebcastLinkmicBattleTaskMessageLinkmicBattleTaskData2
}

export interface WebcastLinkmicBattleTaskMessageLinkmicBattleTaskData  {
    data1: WebcastLinkmicBattleTaskMessageBattleTaskData
}

export interface WebcastLinkmicBattleTaskMessageBattleTaskData  {
    data1: number
}

export interface WebcastLinkmicBattleTaskMessageLinkmicBattleTaskData2  {
    data1: number
    data2: number
}

export interface WebcastLinkMicBattle  {
    common: Common
    id: number
    battle_config: WebcastLinkMicBattleLinkMicBattleConfig
    data2: number
    details: WebcastLinkMicBattleLinkMicBattleDetails[]
    teams1: WebcastLinkMicBattleLinkMicBattleTeam[]
    teams2: WebcastLinkMicBattleLinkMicBattleTeam[]
    team_data: WebcastLinkMicBattleLinkMicBattleTeamData[]
}

export interface WebcastLinkMicBattleLinkMicBattleConfig  {
    id1: number
    timestamp: number
    data1: number
    id2: number
    data2: number
}

export interface WebcastLinkMicBattleLinkMicBattleData  {
    id: number
    data1: number
    data2: number
    data3: number
    url: string
}

export interface WebcastLinkMicBattleLinkMicBattleDetails  {
    id: number
    details: WebcastLinkMicBattleLinkMicBattleData
}

export interface WebcastLinkMicBattleLinkMicBattleTeam  {
    id: number
    users: User[]
}

export interface WebcastLinkMicBattleLinkMicBattleTeamData  {
    team_id: number
    data: WebcastLinkMicBattleLinkMicBattleData
}

export interface WebcastLinkMicFanTicketMethod  {
    common: Common
    fan_ticket_room_notice: FanTicketRoomNoticeContent
}

export interface WebcastLinkMicMethod  {
    common: Common
    message_type: MessageType
    access_key: string
    anchor_linkmic_id: number
    user_id: number
    fan_ticket: number
    total_link_mic_fan_ticket: number
    channel_id: number
    layout: number
    vendor: number
    dimension: number
    theme: string
    invite_uid: number
}

export interface WebcastLiveIntroMessage  {
    common: Common
    room_id: number
    audit_status: AuditStatus
    content: string
    host: User
    intro_mode: number
    badges: BadgeStruct[]
    language: string
}

export interface WebcastUnauthorizedMemberMessage  {
    common: Common
    action: number
    nick_name_prefix: Text
    nick_name: string
    enter_text: Text
}

export interface WebcastMsgDetectMessage  {
    common: Common
    detect_type: number
    trigger_condition: WebcastMsgDetectMessageTriggerCondition
    time_info: WebcastMsgDetectMessageTimeInfo
    trigger_by: number
    from_region: string
}

export interface WebcastMsgDetectMessageTimeInfo  {
    client_start_ms: number
    api_recv_time_ms: number
    api_send_to_goim_ms: number
}

export interface WebcastMsgDetectMessageTriggerCondition  {
    uplink_detect_http: boolean
    uplink_detect_web_socket: boolean
    detect_p2_p_msg: boolean
    detect_room_msg: boolean
    http_optimize: boolean
}

export interface WebcastOecLiveShoppingMessage  {
    common: Common
    data1: number
    shop_data: WebcastOecLiveShoppingMessageLiveShoppingData
    shop_timings: TimeStampContainer
    details: WebcastOecLiveShoppingMessageLiveShoppingDetails
}

export interface WebcastOecLiveShoppingMessageLiveShoppingData  {
    title: string
    price_string: string
    image_url: string
    shop_url: string
    data1: number
    shop_name: string
    data2: number
    shop_url2: string
    data3: number
    data4: number
}

export interface WebcastOecLiveShoppingMessageLiveShoppingDetails  {
    id1: string
    data1: string
    data2: number
    timestamp: number
    data: ValueLabel
}

export interface WebcastRoomPinMessage  {
    common: Common
    pinned_message: unknown
    original_msg_type: string
    timestamp: number
}

export interface WebcastSystemMessage  {
    common: Common
    message: string
}

export interface WebcastLinkMessage  {
    common: Common
    message_type: LinkMessageType
    linker_id: number
    scene: Scene
    invite_content: LinkerInviteContent
    reply_content: LinkerReplyContent
    create_content: LinkerCreateContent
    close_content: LinkerCloseContent
    enter_content: LinkerEnterContent
    leave_content: LinkerLeaveContent
    cancel_content: LinkerCancelContent
    kick_out_content: LinkerKickOutContent
    linked_list_change_content: LinkerLinkedListChangeContent
    update_user_content: LinkerUpdateUserContent
    waiting_list_change_content: LinkerWaitingListChangeContent
    mute_content: LinkerMuteContent
    random_match_content: LinkerRandomMatchContent
    update_user_setting_content: LinkerUpdateUserSettingContent
    mic_idx_update_content: LinkerMicIdxUpdateContent
    list_change_content: LinkerListChangeContent
    cohost_list_change_content: CohostListChangeContent
    media_change_content: LinkerMediaChangeContent
    reply_accept_notice_content: LinkerAcceptNoticeContent
    sys_kick_out_content: LinkerSysKickOutContent
    user_toast_content: LinkmicUserToastContent
    extra: string
    expire_timestamp: number
    transfer_extra: string
}

export interface WebcastLinkLayerMessage  {
    common: Common
    message_type: MessageType
    channel_id: number
    scene: Scene
    create_channel_content: CreateChannelContent
    list_change_content: ListChangeContent
    invite_content: InviteContent
    apply_content: ApplyContent
    permit_apply_content: PermitApplyContent
    reply_invite_content: ReplyInviteContent
    kick_out_content: KickOutContent
    cancel_apply_content: CancelApplyContent
    cancel_invite_content: CancelInviteContent
    leave_content: LeaveContent
    finish_content: FinishChannelContent
    join_direct_content: JoinDirectContent
    join_group_content: JoinGroupContent
    permit_group_content: PermitJoinGroupContent
    cancel_group_content: CancelJoinGroupContent
    leave_group_content: LeaveJoinGroupContent
    p2_p_group_change_content: P2PGroupChangeContent
    business_content: BusinessContent
}

export interface RoomVerifyMessage  {
    common: Common
    action: number
    content: string
    notice_type: number
    close_room: boolean
}

export interface ExtendedUser extends User {
}

export interface ExtendedGiftStruct extends GiftStruct {
}



export interface WebsocketResponseEvent extends WebcastResponseMessage {

}

export interface UnknownEvent extends WebsocketResponseEvent {

}

export interface ConnectEvent  {
    unique_id: string
    room_id: string

}

export interface FollowEvent extends SocialEvent {

}

export interface ShareEvent extends SocialEvent {

}

export interface LiveEndEvent extends ControlEvent {

}

export interface LivePauseEvent extends ControlEvent {

}

export interface LiveUnpauseEvent extends ControlEvent {

}

export interface DisconnectEvent  {

}

export interface GiftEvent extends WebcastGiftMessage {
    user: ExtendedUser
    to_user: ExtendedUser
    gift: ExtendedGiftStruct

}

export interface RoomEvent extends WebcastRoomMessage {

}

export interface BarrageEvent extends WebcastBarrageMessage {

}

export interface CaptionEvent extends WebcastCaptionMessage {

}

export interface CommentEvent extends WebcastChatMessage {
    user: ExtendedUser
    at_user: ExtendedUser

}

export interface ControlEvent extends WebcastControlMessage {

}

export interface EmoteChatEvent extends WebcastEmoteChatMessage {
    user: ExtendedUser

}

export interface EnvelopeEvent extends WebcastEnvelopeMessage {

}

export interface GoalUpdateEvent extends WebcastGoalUpdateMessage {

}

export interface ImDeleteEvent extends WebcastImDeleteMessage {

}

export interface LikeEvent extends WebcastLikeMessage {
    user: ExtendedUser

}

export interface RoomUserSeqEvent extends WebcastRoomUserSeqMessage {

}

export interface SocialEvent extends WebcastSocialMessage {
    user: ExtendedUser

}

export interface SubscribeEvent extends WebcastSubNotifyMessage {
    user: ExtendedUser

}

export interface RankUpdateEvent extends WebcastRankUpdateMessage {

}

export interface JoinEvent extends WebcastMemberMessage {
    user: ExtendedUser
    operator: ExtendedUser

}

export interface PollEvent extends WebcastPollMessage {

}

export interface QuestionNewEvent extends WebcastQuestionNewMessage {

}

export interface RankTextEvent extends WebcastRankTextMessage {

}

export interface HourlyRankEvent extends WebcastHourlyRankMessage {

}

export interface LinkMicArmiesEvent extends WebcastLinkMicArmies {

}

export interface LinkMicBattleEvent extends WebcastLinkMicBattle {

}

export interface LinkMicFanTicketMethodEvent extends WebcastLinkMicFanTicketMethod {

}

export interface LinkMicMethodEvent extends WebcastLinkMicMethod {

}

export interface LiveIntroEvent extends WebcastLiveIntroMessage {
    host: ExtendedUser

}

export interface UnauthorizedMemberEvent extends WebcastUnauthorizedMemberMessage {

}

export interface MessageDetectEvent extends WebcastMsgDetectMessage {

}

export interface OecLiveShoppingEvent extends WebcastOecLiveShoppingMessage {

}

export interface RoomPinEvent extends WebcastRoomPinMessage {

}

export interface SystemEvent extends WebcastSystemMessage {

}

export interface LinkEvent extends WebcastLinkMessage {

}

export interface LinkLayerEvent extends WebcastLinkLayerMessage {

}

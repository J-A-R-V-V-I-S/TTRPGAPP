// UI State types for component and page-level states

// Modal States
interface ModalState {
    isOpen: boolean;
    modalType: ModalType | null;
    modalData?: unknown;
}

type ModalType =
    | 'item'
    | 'spell'
    | 'attack'
    | 'ability'
    | 'power'
    | 'chestItem'
    | 'confirm'
    | 'info';

interface ConfirmModalData {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

// Dropdown/Select States
interface DropdownState {
    isOpen: boolean;
    selectedValue: string | null;
}

// Tooltip States
interface TooltipState {
    isVisible: boolean;
    content: string;
    position: TooltipPosition;
}

interface TooltipPosition {
    x: number;
    y: number;
}

// Form States
interface FormState<T = Record<string, unknown>> {
    data: T;
    errors: FormErrors;
    isSubmitting: boolean;
    isDirty: boolean;
}

type FormErrors = Record<string, string | undefined>;

// Pagination State
interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

// Tab State
interface TabState {
    activeTab: string;
    tabs: Tab[];
}

interface Tab {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

// Loading States
interface LoadingState {
    isLoading: boolean;
    loadingMessage?: string;
}

// Notification/Toast States
interface NotificationState {
    notifications: Notification[];
}

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
    isVisible: boolean;
}

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type {
    ModalState,
    ModalType,
    ConfirmModalData,
    DropdownState,
    TooltipState,
    TooltipPosition,
    FormState,
    FormErrors,
    PaginationState,
    TabState,
    Tab,
    LoadingState,
    NotificationState,
    Notification,
    NotificationType,
};


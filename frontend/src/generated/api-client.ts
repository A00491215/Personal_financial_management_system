/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * * `Canada` - Canada
 * * `US` - US
 */
export enum CountryEnum {
  Canada = "Canada",
  US = "US",
}

/**
 * * `daily` - Daily
 * * `weekly` - Weekly
 * * `monthly` - Monthly
 * * `yearly` - Yearly
 */
export enum BudgetPreferenceEnum {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export interface Category {
  category_id: number;
  /** @maxLength 100 */
  name: string;
}

export interface ChildrenContribution {
  child_id: number;
  user_id: number;
  /** @maxLength 100 */
  child_name: string;
  /** @maxLength 100 */
  parent_name: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  total_contribution_planned?: string | null;
  has_total_contribution?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  monthly_contribution?: string | null;
  /** @format date-time */
  created_at: string;
  user_username: string;
}

export interface Expense {
  /** @format date */
  expense_date: string;
  user_id: number;
  category_id: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  amount: string;
  /** @format date-time */
  created_at: string;
  user_username: string;
  category_name: string;
}

export interface Milestone {
  milestone_id: number;
  /** @maxLength 200 */
  title: string;
  description?: string | null;
}

export interface PatchedCategory {
  category_id?: number;
  /** @maxLength 100 */
  name?: string;
}

export interface PatchedChildrenContribution {
  child_id?: number;
  user_id?: number;
  /** @maxLength 100 */
  child_name?: string;
  /** @maxLength 100 */
  parent_name?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  total_contribution_planned?: string | null;
  has_total_contribution?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  monthly_contribution?: string | null;
  /** @format date-time */
  created_at?: string;
  user_username?: string;
}

export interface PatchedExpense {
  /** @format date */
  expense_date?: string;
  user_id?: number;
  category_id?: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  amount?: string;
  /** @format date-time */
  created_at?: string;
  user_username?: string;
  category_name?: string;
}

export interface PatchedMilestone {
  milestone_id?: number;
  /** @maxLength 200 */
  title?: string;
  description?: string | null;
}

export interface PatchedUser {
  user_id?: number;
  /**
   * @maxLength 150
   * @pattern ^[A-Za-z\s\-]+$
   */
  username?: string;
  /** @maxLength 128 */
  password?: string;
  /**
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z\s\-]+$
   */
  first_name?: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z\s\-]+$
   */
  last_name?: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z\s\-]+$
   */
  city?: string;
  /** @maxLength 50 */
  province_state?: string;
  /**
   * * `Canada` - Canada
   * * `US` - US
   */
  country?: CountryEnum;
  /** @maxLength 20 */
  postal_code?: string;
  /**
   * @maxLength 20
   * @pattern ^\+?1?\s?[-.()]?\s?\d{3}[-.()]?\s?\d{3}[-.()]?\s?\d{4}$
   */
  phone_number?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  salary?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  total_balance?: string | null;
  /**
   * * `daily` - Daily
   * * `weekly` - Weekly
   * * `monthly` - Monthly
   * * `yearly` - Yearly
   */
  budget_preference?: BudgetPreferenceEnum;
  email_notification?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface PatchedUserMilestone {
  umid?: number;
  user_id?: number;
  milestone_id?: number;
  is_completed?: boolean;
  /** @format date-time */
  completed_at?: string | null;
  user_username?: string;
  milestone_title?: string;
  milestone_details?: Milestone;
}

export interface PatchedUserResponse {
  response_id?: number;
  user_id?: number;
  salary_confirmed?: boolean;
  emergency_savings?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  emergency_savings_amount?: string | null;
  has_debt?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  debt_amount?: string | null;
  full_emergency_fund?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  full_emergency_fund_amount?: string | null;
  retirement_investing?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  retirement_savings_amount?: string | null;
  has_children?: boolean;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  children_count?: number | null;
  bought_home?: boolean;
  pay_off_home?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  mortgage_remaining?: string | null;
  /** @format date-time */
  submitted_at?: string;
  user_username?: string;
}

export interface User {
  user_id: number;
  /**
   * @maxLength 150
   * @pattern ^[A-Za-z\s\-]+$
   */
  username: string;
  /** @maxLength 128 */
  password: string;
  /**
   * @format email
   * @maxLength 254
   */
  email: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z\s\-]+$
   */
  first_name: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z\s\-]+$
   */
  last_name: string;
  /**
   * @maxLength 100
   * @pattern ^[A-Za-z\s\-]+$
   */
  city: string;
  /** @maxLength 50 */
  province_state: string;
  /**
   * * `Canada` - Canada
   * * `US` - US
   */
  country: CountryEnum;
  /** @maxLength 20 */
  postal_code: string;
  /**
   * @maxLength 20
   * @pattern ^\+?1?\s?[-.()]?\s?\d{3}[-.()]?\s?\d{3}[-.()]?\s?\d{4}$
   */
  phone_number: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  salary?: string | null;
  /**
   * @format decimal
   * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
   */
  total_balance?: string | null;
  /**
   * * `daily` - Daily
   * * `weekly` - Weekly
   * * `monthly` - Monthly
   * * `yearly` - Yearly
   */
  budget_preference?: BudgetPreferenceEnum;
  email_notification?: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface UserMilestone {
  umid: number;
  user_id: number;
  milestone_id: number;
  is_completed?: boolean;
  /** @format date-time */
  completed_at?: string | null;
  user_username: string;
  milestone_title: string;
  milestone_details: Milestone;
}

export interface UserResponse {
  response_id: number;
  user_id: number;
  salary_confirmed?: boolean;
  emergency_savings?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  emergency_savings_amount?: string | null;
  has_debt?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  debt_amount?: string | null;
  full_emergency_fund?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  full_emergency_fund_amount?: string | null;
  retirement_investing?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  retirement_savings_amount?: string | null;
  has_children?: boolean;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  children_count?: number | null;
  bought_home?: boolean;
  pay_off_home?: boolean;
  /**
   * @format decimal
   * @pattern ^-?\d{0,10}(?:\.\d{0,2})?$
   */
  mortgage_remaining?: string | null;
  /** @format date-time */
  submitted_at: string;
  user_username: string;
}

export type CategoriesListData = Category[];

export type CategoriesCreateData = Category;

export interface CategoriesRetrieveParams {
  /** A unique integer value identifying this category. */
  categoryId: number;
}

export type CategoriesRetrieveData = Category;

export interface CategoriesUpdateParams {
  /** A unique integer value identifying this category. */
  categoryId: number;
}

export type CategoriesUpdateData = Category;

export interface CategoriesPartialUpdateParams {
  /** A unique integer value identifying this category. */
  categoryId: number;
}

export type CategoriesPartialUpdateData = Category;

export interface CategoriesDestroyParams {
  /** A unique integer value identifying this category. */
  categoryId: number;
}

export type CategoriesDestroyData = any;

export interface ChildrenContributionsListParams {
  /** Filter children by user */
  user_id?: number;
}

export type ChildrenContributionsListData = ChildrenContribution[];

export interface ChildrenContributionsCreateParams {
  /** Filter children by user */
  user_id?: number;
}

export type ChildrenContributionsCreateData = ChildrenContribution;

export interface ChildrenContributionsRetrieveParams {
  /** Filter children by user */
  user_id?: number;
  id: string;
}

export type ChildrenContributionsRetrieveData = ChildrenContribution;

export interface ChildrenContributionsUpdateParams {
  /** Filter children by user */
  user_id?: number;
  id: string;
}

export type ChildrenContributionsUpdateData = ChildrenContribution;

export interface ChildrenContributionsPartialUpdateParams {
  /** Filter children by user */
  user_id?: number;
  id: string;
}

export type ChildrenContributionsPartialUpdateData = ChildrenContribution;

export interface ChildrenContributionsDestroyParams {
  /** Filter children by user */
  user_id?: number;
  id: string;
}

export type ChildrenContributionsDestroyData = any;

export type ExpensesListData = Expense[];

export type ExpensesCreateData = Expense;

export interface ExpensesRetrieveParams {
  /**
   * A unique value identifying this expense.
   * @format date
   */
  expenseDate: string;
}

export type ExpensesRetrieveData = Expense;

export interface ExpensesUpdateParams {
  /**
   * A unique value identifying this expense.
   * @format date
   */
  expenseDate: string;
}

export type ExpensesUpdateData = Expense;

export interface ExpensesPartialUpdateParams {
  /**
   * A unique value identifying this expense.
   * @format date
   */
  expenseDate: string;
}

export type ExpensesPartialUpdateData = Expense;

export interface ExpensesDestroyParams {
  /**
   * A unique value identifying this expense.
   * @format date
   */
  expenseDate: string;
}

export type ExpensesDestroyData = any;

export type MilestonesListData = Milestone[];

export type MilestonesCreateData = Milestone;

export interface MilestonesRetrieveParams {
  /** A unique integer value identifying this milestone. */
  milestoneId: number;
}

export type MilestonesRetrieveData = Milestone;

export interface MilestonesUpdateParams {
  /** A unique integer value identifying this milestone. */
  milestoneId: number;
}

export type MilestonesUpdateData = Milestone;

export interface MilestonesPartialUpdateParams {
  /** A unique integer value identifying this milestone. */
  milestoneId: number;
}

export type MilestonesPartialUpdateData = Milestone;

export interface MilestonesDestroyParams {
  /** A unique integer value identifying this milestone. */
  milestoneId: number;
}

export type MilestonesDestroyData = any;

export type UserMilestonesListData = UserMilestone[];

export type UserMilestonesCreateData = UserMilestone;

export interface UserMilestonesRetrieveParams {
  /** A unique integer value identifying this user milestone. */
  umid: number;
}

export type UserMilestonesRetrieveData = UserMilestone;

export interface UserMilestonesUpdateParams {
  /** A unique integer value identifying this user milestone. */
  umid: number;
}

export type UserMilestonesUpdateData = UserMilestone;

export interface UserMilestonesPartialUpdateParams {
  /** A unique integer value identifying this user milestone. */
  umid: number;
}

export type UserMilestonesPartialUpdateData = UserMilestone;

export interface UserMilestonesDestroyParams {
  /** A unique integer value identifying this user milestone. */
  umid: number;
}

export type UserMilestonesDestroyData = any;

export type UserResponsesListData = UserResponse[];

export type UserResponsesCreateData = UserResponse;

export interface UserResponsesRetrieveParams {
  /** A unique integer value identifying this user response. */
  responseId: number;
}

export type UserResponsesRetrieveData = UserResponse;

export interface UserResponsesUpdateParams {
  /** A unique integer value identifying this user response. */
  responseId: number;
}

export type UserResponsesUpdateData = UserResponse;

export interface UserResponsesPartialUpdateParams {
  /** A unique integer value identifying this user response. */
  responseId: number;
}

export type UserResponsesPartialUpdateData = UserResponse;

export interface UserResponsesDestroyParams {
  /** A unique integer value identifying this user response. */
  responseId: number;
}

export type UserResponsesDestroyData = any;

export type UserResponsesMilestonesStatusRetrieveData = UserResponse;

export type UsersListData = User[];

export type UsersCreateData = User;

export interface UsersRetrieveParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersRetrieveData = User;

export interface UsersUpdateParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersUpdateData = User;

export interface UsersPartialUpdateParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersPartialUpdateData = User;

export interface UsersDestroyParams {
  /** A unique integer value identifying this user. */
  userId: number;
}

export type UsersDestroyData = any;

export type UsersLoginCreateData = User;

export type UsersRegisterCreateData = User;

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Financial Planning API
 * @version 1.0.0
 *
 * API for financial planning and budgeting application
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags categories
     * @name CategoriesList
     * @request GET:/api/categories/
     * @secure
     */
    categoriesList: (params: RequestParams = {}) =>
      this.request<CategoriesListData, any>({
        path: `/api/categories/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name CategoriesCreate
     * @request POST:/api/categories/
     * @secure
     */
    categoriesCreate: (data: Category, params: RequestParams = {}) =>
      this.request<CategoriesCreateData, any>({
        path: `/api/categories/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name CategoriesRetrieve
     * @request GET:/api/categories/{category_id}/
     * @secure
     */
    categoriesRetrieve: (
      { categoryId, ...query }: CategoriesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<CategoriesRetrieveData, any>({
        path: `/api/categories/${categoryId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name CategoriesUpdate
     * @request PUT:/api/categories/{category_id}/
     * @secure
     */
    categoriesUpdate: (
      { categoryId, ...query }: CategoriesUpdateParams,
      data: Category,
      params: RequestParams = {},
    ) =>
      this.request<CategoriesUpdateData, any>({
        path: `/api/categories/${categoryId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name CategoriesPartialUpdate
     * @request PATCH:/api/categories/{category_id}/
     * @secure
     */
    categoriesPartialUpdate: (
      { categoryId, ...query }: CategoriesPartialUpdateParams,
      data: PatchedCategory,
      params: RequestParams = {},
    ) =>
      this.request<CategoriesPartialUpdateData, any>({
        path: `/api/categories/${categoryId}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name CategoriesDestroy
     * @request DELETE:/api/categories/{category_id}/
     * @secure
     */
    categoriesDestroy: (
      { categoryId, ...query }: CategoriesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<CategoriesDestroyData, any>({
        path: `/api/categories/${categoryId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsList
     * @request GET:/api/children-contributions/
     * @secure
     */
    childrenContributionsList: (
      query: ChildrenContributionsListParams,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsListData, any>({
        path: `/api/children-contributions/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsCreate
     * @request POST:/api/children-contributions/
     * @secure
     */
    childrenContributionsCreate: (
      query: ChildrenContributionsCreateParams,
      data: ChildrenContribution,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsCreateData, any>({
        path: `/api/children-contributions/`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsRetrieve
     * @request GET:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsRetrieve: (
      { id, ...query }: ChildrenContributionsRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsRetrieveData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsUpdate
     * @request PUT:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsUpdate: (
      { id, ...query }: ChildrenContributionsUpdateParams,
      data: ChildrenContribution,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsUpdateData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsPartialUpdate
     * @request PATCH:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsPartialUpdate: (
      { id, ...query }: ChildrenContributionsPartialUpdateParams,
      data: PatchedChildrenContribution,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsPartialUpdateData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "PATCH",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags children-contributions
     * @name ChildrenContributionsDestroy
     * @request DELETE:/api/children-contributions/{id}/
     * @secure
     */
    childrenContributionsDestroy: (
      { id, ...query }: ChildrenContributionsDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<ChildrenContributionsDestroyData, any>({
        path: `/api/children-contributions/${id}/`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesList
     * @request GET:/api/expenses/
     * @secure
     */
    expensesList: (params: RequestParams = {}) =>
      this.request<ExpensesListData, any>({
        path: `/api/expenses/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesCreate
     * @request POST:/api/expenses/
     * @secure
     */
    expensesCreate: (data: Expense, params: RequestParams = {}) =>
      this.request<ExpensesCreateData, any>({
        path: `/api/expenses/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesRetrieve
     * @request GET:/api/expenses/{expense_date}/
     * @secure
     */
    expensesRetrieve: (
      { expenseDate, ...query }: ExpensesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesRetrieveData, any>({
        path: `/api/expenses/${expenseDate}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesUpdate
     * @request PUT:/api/expenses/{expense_date}/
     * @secure
     */
    expensesUpdate: (
      { expenseDate, ...query }: ExpensesUpdateParams,
      data: Expense,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesUpdateData, any>({
        path: `/api/expenses/${expenseDate}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesPartialUpdate
     * @request PATCH:/api/expenses/{expense_date}/
     * @secure
     */
    expensesPartialUpdate: (
      { expenseDate, ...query }: ExpensesPartialUpdateParams,
      data: PatchedExpense,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesPartialUpdateData, any>({
        path: `/api/expenses/${expenseDate}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expenses
     * @name ExpensesDestroy
     * @request DELETE:/api/expenses/{expense_date}/
     * @secure
     */
    expensesDestroy: (
      { expenseDate, ...query }: ExpensesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<ExpensesDestroyData, any>({
        path: `/api/expenses/${expenseDate}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesList
     * @request GET:/api/milestones/
     * @secure
     */
    milestonesList: (params: RequestParams = {}) =>
      this.request<MilestonesListData, any>({
        path: `/api/milestones/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesCreate
     * @request POST:/api/milestones/
     * @secure
     */
    milestonesCreate: (data: Milestone, params: RequestParams = {}) =>
      this.request<MilestonesCreateData, any>({
        path: `/api/milestones/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesRetrieve
     * @request GET:/api/milestones/{milestone_id}/
     * @secure
     */
    milestonesRetrieve: (
      { milestoneId, ...query }: MilestonesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<MilestonesRetrieveData, any>({
        path: `/api/milestones/${milestoneId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesUpdate
     * @request PUT:/api/milestones/{milestone_id}/
     * @secure
     */
    milestonesUpdate: (
      { milestoneId, ...query }: MilestonesUpdateParams,
      data: Milestone,
      params: RequestParams = {},
    ) =>
      this.request<MilestonesUpdateData, any>({
        path: `/api/milestones/${milestoneId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesPartialUpdate
     * @request PATCH:/api/milestones/{milestone_id}/
     * @secure
     */
    milestonesPartialUpdate: (
      { milestoneId, ...query }: MilestonesPartialUpdateParams,
      data: PatchedMilestone,
      params: RequestParams = {},
    ) =>
      this.request<MilestonesPartialUpdateData, any>({
        path: `/api/milestones/${milestoneId}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags milestones
     * @name MilestonesDestroy
     * @request DELETE:/api/milestones/{milestone_id}/
     * @secure
     */
    milestonesDestroy: (
      { milestoneId, ...query }: MilestonesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<MilestonesDestroyData, any>({
        path: `/api/milestones/${milestoneId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesList
     * @request GET:/api/user-milestones/
     * @secure
     */
    userMilestonesList: (params: RequestParams = {}) =>
      this.request<UserMilestonesListData, any>({
        path: `/api/user-milestones/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesCreate
     * @request POST:/api/user-milestones/
     * @secure
     */
    userMilestonesCreate: (data: UserMilestone, params: RequestParams = {}) =>
      this.request<UserMilestonesCreateData, any>({
        path: `/api/user-milestones/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesRetrieve
     * @request GET:/api/user-milestones/{umid}/
     * @secure
     */
    userMilestonesRetrieve: (
      { umid, ...query }: UserMilestonesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesRetrieveData, any>({
        path: `/api/user-milestones/${umid}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesUpdate
     * @request PUT:/api/user-milestones/{umid}/
     * @secure
     */
    userMilestonesUpdate: (
      { umid, ...query }: UserMilestonesUpdateParams,
      data: UserMilestone,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesUpdateData, any>({
        path: `/api/user-milestones/${umid}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesPartialUpdate
     * @request PATCH:/api/user-milestones/{umid}/
     * @secure
     */
    userMilestonesPartialUpdate: (
      { umid, ...query }: UserMilestonesPartialUpdateParams,
      data: PatchedUserMilestone,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesPartialUpdateData, any>({
        path: `/api/user-milestones/${umid}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-milestones
     * @name UserMilestonesDestroy
     * @request DELETE:/api/user-milestones/{umid}/
     * @secure
     */
    userMilestonesDestroy: (
      { umid, ...query }: UserMilestonesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<UserMilestonesDestroyData, any>({
        path: `/api/user-milestones/${umid}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesList
     * @request GET:/api/user-responses/
     * @secure
     */
    userResponsesList: (params: RequestParams = {}) =>
      this.request<UserResponsesListData, any>({
        path: `/api/user-responses/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesCreate
     * @request POST:/api/user-responses/
     * @secure
     */
    userResponsesCreate: (data: UserResponse, params: RequestParams = {}) =>
      this.request<UserResponsesCreateData, any>({
        path: `/api/user-responses/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesRetrieve
     * @request GET:/api/user-responses/{response_id}/
     * @secure
     */
    userResponsesRetrieve: (
      { responseId, ...query }: UserResponsesRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesRetrieveData, any>({
        path: `/api/user-responses/${responseId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesUpdate
     * @request PUT:/api/user-responses/{response_id}/
     * @secure
     */
    userResponsesUpdate: (
      { responseId, ...query }: UserResponsesUpdateParams,
      data: UserResponse,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesUpdateData, any>({
        path: `/api/user-responses/${responseId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesPartialUpdate
     * @request PATCH:/api/user-responses/{response_id}/
     * @secure
     */
    userResponsesPartialUpdate: (
      { responseId, ...query }: UserResponsesPartialUpdateParams,
      data: PatchedUserResponse,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesPartialUpdateData, any>({
        path: `/api/user-responses/${responseId}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesDestroy
     * @request DELETE:/api/user-responses/{response_id}/
     * @secure
     */
    userResponsesDestroy: (
      { responseId, ...query }: UserResponsesDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<UserResponsesDestroyData, any>({
        path: `/api/user-responses/${responseId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-responses
     * @name UserResponsesMilestonesStatusRetrieve
     * @request GET:/api/user-responses/milestones-status/
     * @secure
     */
    userResponsesMilestonesStatusRetrieve: (params: RequestParams = {}) =>
      this.request<UserResponsesMilestonesStatusRetrieveData, any>({
        path: `/api/user-responses/milestones-status/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Handles: - /api/users/register/ - /api/users/login/ - /api/users/<id>/ (GET / PATCH)
     *
     * @tags users
     * @name UsersList
     * @request GET:/api/users/
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<UsersListData, any>({
        path: `/api/users/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Handles: - /api/users/register/ - /api/users/login/ - /api/users/<id>/ (GET / PATCH)
     *
     * @tags users
     * @name UsersCreate
     * @request POST:/api/users/
     * @secure
     */
    usersCreate: (data: User, params: RequestParams = {}) =>
      this.request<UsersCreateData, any>({
        path: `/api/users/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Handles: - /api/users/register/ - /api/users/login/ - /api/users/<id>/ (GET / PATCH)
     *
     * @tags users
     * @name UsersRetrieve
     * @request GET:/api/users/{user_id}/
     * @secure
     */
    usersRetrieve: (
      { userId, ...query }: UsersRetrieveParams,
      params: RequestParams = {},
    ) =>
      this.request<UsersRetrieveData, any>({
        path: `/api/users/${userId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Handles: - /api/users/register/ - /api/users/login/ - /api/users/<id>/ (GET / PATCH)
     *
     * @tags users
     * @name UsersUpdate
     * @request PUT:/api/users/{user_id}/
     * @secure
     */
    usersUpdate: (
      { userId, ...query }: UsersUpdateParams,
      data: User,
      params: RequestParams = {},
    ) =>
      this.request<UsersUpdateData, any>({
        path: `/api/users/${userId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Handles: - /api/users/register/ - /api/users/login/ - /api/users/<id>/ (GET / PATCH)
     *
     * @tags users
     * @name UsersPartialUpdate
     * @request PATCH:/api/users/{user_id}/
     * @secure
     */
    usersPartialUpdate: (
      { userId, ...query }: UsersPartialUpdateParams,
      data: PatchedUser,
      params: RequestParams = {},
    ) =>
      this.request<UsersPartialUpdateData, any>({
        path: `/api/users/${userId}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Handles: - /api/users/register/ - /api/users/login/ - /api/users/<id>/ (GET / PATCH)
     *
     * @tags users
     * @name UsersDestroy
     * @request DELETE:/api/users/{user_id}/
     * @secure
     */
    usersDestroy: (
      { userId, ...query }: UsersDestroyParams,
      params: RequestParams = {},
    ) =>
      this.request<UsersDestroyData, any>({
        path: `/api/users/${userId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Authenticate user with JWT tokens.
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/api/users/login/
     * @secure
     */
    usersLoginCreate: (data: User, params: RequestParams = {}) =>
      this.request<UsersLoginCreateData, any>({
        path: `/api/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new user and return JWT tokens.
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/api/users/register/
     * @secure
     */
    usersRegisterCreate: (data: User, params: RequestParams = {}) =>
      this.request<UsersRegisterCreateData, any>({
        path: `/api/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
